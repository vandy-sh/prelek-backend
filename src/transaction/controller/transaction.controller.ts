// import { Controller, Post } from '@nestjs/common';
// import { CommandBus } from '@nestjs/cqrs';
// import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { BaseApiOkResponse } from '../../core/decorators/base.api.ok.response.decorator';
// import { TransactionEntity } from '../dto/transaction.dto';
// import { Builder } from 'builder-pattern';

// @ApiTags('transaction')
// @Controller('transactions')
// export class transactionController {
//   constructor(private readonly commandBus: CommandBus) {}
// }

// @BaseApiOkResponse(TransactionEntity, 'object')
// @Post('transaction')
// async transactiona(@Res() res: Response, @Body() dto: TransactionEntity){
//   try{
//     const command = Builder<UpdateTransactionCommand>(UpdateTrasactionCommand,
//       ...dto,
//     ).build();

//   }
// }
