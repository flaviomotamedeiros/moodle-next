import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module.js'
import { CourseModule } from './modules/course/course.module.js'
import { EnrollmentModule } from './modules/enrollment/enrollment.module.js'
import { ActivityModule } from './modules/activity/activity.module.js'
import { GradingModule } from './modules/grading/grading.module.js'
import { EventBusModule } from './infrastructure/event-bus/event-bus.module.js'
import { PluginRegistryModule } from './infrastructure/plugin-registry/plugin-registry.module.js'
import { DatabaseModule } from './infrastructure/database/database.module.js'
import { MeModule } from './modules/me/me.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EventBusModule,
    PluginRegistryModule,
    AuthModule,
    CourseModule,
    EnrollmentModule,
    ActivityModule,
    GradingModule,
    MeModule,
  ],
})
export class AppModule {}
