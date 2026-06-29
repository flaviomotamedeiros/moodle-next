import { Module } from '@nestjs/common'
import { MigrationController } from './migration.controller.js'

@Module({ controllers: [MigrationController] })
export class MigrationModule {}
