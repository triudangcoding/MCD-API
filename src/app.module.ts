import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BranchModule } from './branch/branch.module';
import { FacultyModule } from './faculty/faculty.module';
import { SubjectModule } from './subject/subject.module';
import { OnlineClassModule } from './online-class/online-class.module';
import { ClassMemberModule } from './class-member/class-member.module';
import { LessonModule } from './lesson/lesson.module';
import { FileResourceModule } from './file-resource/file-resource.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { ReactionModule } from './reaction/reaction.module';
import { TeacherCalendarModule } from './teacher-calendar/teacher-calendar.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    UserModule,
    BranchModule,
    FacultyModule,
    SubjectModule,
    OnlineClassModule,
    ClassMemberModule,
    LessonModule,
    FileResourceModule,
    PostModule,
    CommentModule,
    ReactionModule,
    TeacherCalendarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
