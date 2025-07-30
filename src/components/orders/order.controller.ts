import { Controller, Get, Param, ParseIntPipe, Post, Body, Headers, Query, ForbiddenException, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam, ApiCreatedResponse, ApiBody } from '@nestjs/swagger';
import { OrderService } from '@providers';
import { CreateOrderDto, FilterOrdersDto, PaginatedResponseDto, UpdateOrderStatusDto } from '@dtos';
import { OrderEntity } from '@entities';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

 

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id with items' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: OrderEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOneDetailed(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get orders for user' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiOkResponse({ type: PaginatedResponseDto })
  getUserOrders(
    @Param('userId', ParseIntPipe) userId: number,
    @Headers('user_id') headerUserId: string,
    @Query() query: FilterOrdersDto,
  ): Promise<PaginatedResponseDto<any>> {
    if (!headerUserId || Number(headerUserId) !== userId) {
      throw new ForbiddenException('Forbidden');
    }
    return this.orderService.findByUser(userId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiCreatedResponse()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Put(':orderId/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  @ApiParam({ name: 'orderId', type: Number })
  @ApiOkResponse({ type: OrderEntity })
  cancel(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Headers('user_id') headerUserId: string,
  ) {
    const uid = Number(headerUserId);
    if (!uid) throw new ForbiddenException('Forbidden');
    return this.orderService.cancel(orderId, uid);
  }

  @Put(':orderId/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'orderId', type: Number })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiOkResponse({ type: OrderEntity })
  updateStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(orderId, dto);
  }
} 