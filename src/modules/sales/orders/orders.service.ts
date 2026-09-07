import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import Decimal from 'decimal.js';

import { CustomersRepository } from '../customers/customers.repository';
import { ProductsRepository } from '../../inventory/products/products.repository';

import { OrderStatus } from './enums/order-status.enum';
import { OrderItemsRepository } from './repositories/order-items.repository';
import { OrdersRepository } from './repositories/orders.repository';
import { OrderListMapper } from './mappers/order-list.mapper';
import { OrderMapper } from './mappers/order.mapper';
import {
  CreateOrderDto,
  CreateOrderItemDto,
  OrderQueryDto,
  UpdateOrderDto,
  UpdateOrderItemDto,
} from './dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { Product } from 'src/modules/inventory/products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly customersRepository: CustomersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { customerId, items, discount = '0', notes } = createOrderDto;

    const customer = await this.customersRepository.findById(customerId);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const productIds = items.map((item) => item.productId);

    const uniqueProductIds = new Set(productIds);

    if (uniqueProductIds.size !== productIds.length) {
      throw new ConflictException(
        'A product cannot be added more than once to the same order',
      );
    }

    const products = await Promise.all(
      productIds.map((productId) =>
        this.productsRepository.findById(productId),
      ),
    );

    products.forEach((product, index) => {
      if (!product) {
        throw new NotFoundException(`Product ${productIds[index]} not found`);
      }
    });

    const productMap = new Map(
      products.map((product) => [product!.id, product!]),
    );

    const orderItemsData = items.map((item) => {
      const product = productMap.get(item.productId)!;

      const unitPrice = new Decimal(product.sellingPrice);

      const itemSubtotal = unitPrice.times(item.quantity).toFixed(2);

      return {
        productId: product.id,
        quantity: item.quantity,
        unitPrice: unitPrice.toFixed(2),
        subtotal: itemSubtotal,
      };
    });

    const subtotal = orderItemsData.reduce(
      (total, item) => total.plus(new Decimal(item.subtotal)),
      new Decimal(0),
    );

    const discountDecimal = new Decimal(discount);

    if (discountDecimal.greaterThan(subtotal)) {
      throw new BadRequestException(
        'Discount cannot be greater than order subtotal',
      );
    }

    const total = subtotal.minus(discountDecimal);
    return await this.dataSource.transaction(async (manager) => {
      const sequence =
        await this.ordersRepository.getNextOrderNumberSequence(manager);

      const year = new Date().getFullYear();

      const orderNumber = `ORD-${year}-${String(sequence).padStart(6, '0')}`;

      const savedOrder = await this.ordersRepository.createAndSave(manager, {
        orderNumber,
        customerId,
        status: OrderStatus.PENDING,
        subtotal: subtotal.toFixed(2),
        discount: discountDecimal.toFixed(2),
        total: total.toFixed(2),
        notes: notes ?? null,
      });

      const orderItems = orderItemsData.map((item) => ({
        ...item,
        orderId: savedOrder.id,
      }));

      await this.orderItemsRepository.createAndSaveMany(manager, orderItems);

      const order = await this.ordersRepository.findByIdWithCustomerAndItems(
        savedOrder.id,
        manager,
      );

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      return OrderMapper.toResponseDto(order);
    });
  }

  async findAll(query: OrderQueryDto) {
    const { page, limit, customerId, status } = query;

    const [orders, total] = await this.ordersRepository.findPaginated(
      page,
      limit,
      customerId,
      status,
    );

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },

      data: OrderListMapper.toResponseDtoList(orders),
    };
  }

  async findOne(id: string) {
    const order = await this.ordersRepository.findByIdWithCustomerAndItems(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return OrderMapper.toResponseDto(order);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new ConflictException('Only pending orders can be updated');
    }

    if (updateOrderDto.customerId) {
      const customer = await this.customersRepository.findById(
        updateOrderDto.customerId,
      );

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
    }

    if (updateOrderDto.discount !== undefined) {
      const discount = new Decimal(updateOrderDto.discount);

      if (discount.greaterThan(new Decimal(order.subtotal))) {
        throw new BadRequestException(
          'Discount cannot be greater than order subtotal',
        );
      }

      order.discount = discount.toFixed(2);

      order.total = new Decimal(order.subtotal).minus(discount).toFixed(2);
    }

    if (updateOrderDto.customerId !== undefined) {
      order.customerId = updateOrderDto.customerId;
    }

    if (updateOrderDto.notes !== undefined) {
      order.notes = updateOrderDto.notes;
    }

    const updatedOrder = await this.ordersRepository.save(order);

    const orderWithRelations =
      await this.ordersRepository.findByIdWithCustomerAndItems(updatedOrder.id);

    if (!orderWithRelations) {
      throw new NotFoundException('Order not found');
    }

    return OrderMapper.toResponseDto(orderWithRelations);
  }

  async cancel(id: string) {
    return this.dataSource.transaction(async (manager) => {
      const order = await this.ordersRepository.findByIdForUpdateWithItems(
        id,
        manager,
      );

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (
        order.status !== OrderStatus.PENDING &&
        order.status !== OrderStatus.CONFIRMED
      ) {
        throw new ConflictException(
          'Only pending or confirmed orders can be cancelled',
        );
      }

      if (order.status === OrderStatus.CONFIRMED) {
        const items = [...order.items].sort((a, b) =>
          a.productId.localeCompare(b.productId),
        );

        for (const item of items) {
          const product = await this.productsRepository.findByIdForUpdate(
            item.productId,
            manager,
          );

          if (!product) {
            throw new NotFoundException(`Product ${item.productId} not found`);
          }

          product.currentStock += item.quantity;

          await manager.getRepository(Product).save(product);
        }
      }

      order.status = OrderStatus.CANCELLED;

      await manager.getRepository(Order).save(order);

      const cancelledOrder =
        await this.ordersRepository.findByIdWithCustomerAndItems(id, manager);

      if (!cancelledOrder) {
        throw new NotFoundException('Order not found');
      }

      return OrderMapper.toResponseDto(cancelledOrder);
    });
  }

  // Order items
  async addItem(orderId: string, createOrderItemDto: CreateOrderItemDto) {
    const { productId, quantity } = createOrderItemDto;

    return this.dataSource.transaction(async (manager) => {
      const order = await this.ordersRepository.findByIdForUpdate(
        orderId,
        manager,
      );

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new ConflictException(
          'Items can only be modified for pending orders',
        );
      }

      const product = await this.productsRepository.findById(productId);

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const existingItem =
        await this.orderItemsRepository.findByOrderAndProduct(
          orderId,
          productId,
          manager,
        );

      if (existingItem) {
        throw new ConflictException('Product already exists in this order');
      }

      const unitPrice = new Decimal(product.sellingPrice);

      const itemSubtotal = unitPrice.times(quantity).toFixed(2);

      order.subtotal = new Decimal(order.subtotal)
        .plus(itemSubtotal)
        .toFixed(2);

      order.total = new Decimal(order.subtotal)
        .minus(order.discount)
        .toFixed(2);

      await this.orderItemsRepository.createAndSave(manager, {
        orderId,
        productId,
        quantity,
        unitPrice: unitPrice.toFixed(2),
        subtotal: itemSubtotal,
      });

      await manager.getRepository(Order).save(order);

      const updatedOrder =
        await this.ordersRepository.findByIdWithCustomerAndItems(
          orderId,
          manager,
        );

      if (!updatedOrder) {
        throw new NotFoundException('Order not found');
      }

      return OrderMapper.toResponseDto(updatedOrder);
    });
  }

  async updateItemQuantity(
    orderId: string,
    itemId: string,
    updateOrderItemDto: UpdateOrderItemDto,
  ) {
    const { quantity } = updateOrderItemDto;

    return this.dataSource.transaction(async (manager) => {
      const order = await this.ordersRepository.findByIdForUpdate(
        orderId,
        manager,
      );

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new ConflictException(
          'Items can only be modified for pending orders',
        );
      }

      const orderItem = await this.orderItemsRepository.findByIdAndOrderId(
        itemId,
        orderId,
        manager,
      );

      if (!orderItem) {
        throw new NotFoundException('Order item not found');
      }

      const oldSubtotal = new Decimal(orderItem.subtotal);

      const newSubtotal = new Decimal(orderItem.unitPrice)
        .times(quantity)
        .toFixed(2);

      const subtotalDelta = new Decimal(newSubtotal).minus(oldSubtotal);

      orderItem.quantity = quantity;
      orderItem.subtotal = newSubtotal;

      order.subtotal = new Decimal(order.subtotal)
        .plus(subtotalDelta)
        .toFixed(2);

      order.total = new Decimal(order.subtotal)
        .minus(order.discount)
        .toFixed(2);

      await manager.getRepository(OrderItem).save(orderItem);
      await manager.getRepository(Order).save(order);

      const updatedOrder =
        await this.ordersRepository.findByIdWithCustomerAndItems(
          orderId,
          manager,
        );

      if (!updatedOrder) {
        throw new NotFoundException('Order not found');
      }

      return OrderMapper.toResponseDto(updatedOrder);
    });
  }

  async removeItem(orderId: string, itemId: string) {
    return this.dataSource.transaction(async (manager) => {
      const order = await this.ordersRepository.findByIdForUpdate(
        orderId,
        manager,
      );

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new ConflictException(
          'Items can only be modified for pending orders',
        );
      }

      const orderItem = await this.orderItemsRepository.findByIdAndOrderId(
        itemId,
        orderId,
        manager,
      );

      if (!orderItem) {
        throw new NotFoundException('Order item not found');
      }

      order.subtotal = new Decimal(order.subtotal)
        .minus(orderItem.subtotal)
        .toFixed(2);

      order.total = new Decimal(order.subtotal)
        .minus(order.discount)
        .toFixed(2);

      await manager.getRepository(OrderItem).remove(orderItem);
      await manager.getRepository(Order).save(order);

      const updatedOrder =
        await this.ordersRepository.findByIdWithCustomerAndItems(
          orderId,
          manager,
        );

      if (!updatedOrder) {
        throw new NotFoundException('Order not found');
      }

      return OrderMapper.toResponseDto(updatedOrder);
    });
  }

  async confirm(id: string) {
    return this.dataSource.transaction(async (manager) => {
      // 1. Lock the order only
      const order = await this.ordersRepository.findByIdForUpdate(id, manager);

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new ConflictException('Only pending orders can be confirmed');
      }

      // 2. Load order items without FOR UPDATE
      const items = await manager.getRepository(OrderItem).find({
        where: {
          orderId: id,
        },
        order: {
          productId: 'ASC',
        },
      });

      if (!items.length) {
        throw new BadRequestException('Cannot confirm an order without items');
      }

      // 3. Lock products in deterministic order
      for (const item of items) {
        const product = await this.productsRepository.findByIdForUpdate(
          item.productId,
          manager,
        );

        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }

        if (product.currentStock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}`,
          );
        }

        product.currentStock -= item.quantity;

        await manager.getRepository(Product).save(product);
      }

      // 4. Confirm order
      order.status = OrderStatus.CONFIRMED;

      await manager.getRepository(Order).save(order);

      // 5. Load relations for response AFTER locking is finished
      const confirmedOrder =
        await this.ordersRepository.findByIdWithCustomerAndItems(id, manager);

      if (!confirmedOrder) {
        throw new NotFoundException('Order not found');
      }

      return OrderMapper.toResponseDto(confirmedOrder);
    });
  }
}
