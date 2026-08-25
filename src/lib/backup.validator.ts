import {
  BackupData,
  BackupPayload,
  BackupValidationResult,
  DepartmentMeetingRecord,
  DepartmentRecord,
  DocumentLink,
  EvaluationRating,
  GradeLevel,
  JournalEntry,
  LessonEvaluationRecord,
  LessonStatus,
  LessonType,
  MeetingTopic,
  PPCTLesson,
  PPCTPlan,
  Priority,
  Prompt,
  Student,
  Task,
  TeacherAssignmentRecord,
  TrackType,
} from '../types';

function isValidString(val: unknown): val is string {
  return typeof val === 'string';
}

function isValidNumber(val: unknown): val is number {
  return typeof val === 'number' && !Number.isNaN(val);
}

function isValidBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean';
}

function sanitizeId(id: unknown): string {
  return typeof id === 'string' && id.trim() ? id.trim() : crypto.randomUUID();
}

function sanitizeTimestamp(ts: unknown, fallback: number): number {
  return isValidNumber(ts) && ts > 0 ? ts : fallback;
}

export function validateBackupData(raw: unknown): BackupValidationResult {
  const errors: string[] = [];
  const now = Date.now();

  const emptySummary = {
    tasks: 0,
    prompts: 0,
    docs: 0,
    journals: 0,
    students: 0,
    ppct: 0,
    department: 0,
  };

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      isValid: false,
      errors: ['Dữ liệu sao lưu không đúng định dạng JSON object.'],
      summary: emptySummary,
    };
  }

  const rawObj = raw as Record<string, unknown>;

  // Detect payload container (new format with `data` sub-object or legacy flat format)
  let rawPayload: Record<string, unknown>;
  let version = '1.2.0';
  let exportedAt = new Date().toISOString();

  if (rawObj.data && typeof rawObj.data === 'object' && !Array.isArray(rawObj.data)) {
    rawPayload = rawObj.data as Record<string, unknown>;
    if (isValidString(rawObj.version)) version = rawObj.version;
    if (isValidString(rawObj.exportedAt)) exportedAt = rawObj.exportedAt;
  } else {
    rawPayload = rawObj;
  }

  const tasks: Task[] = [];
  const prompts: Prompt[] = [];
  const docs: DocumentLink[] = [];
  const journals: JournalEntry[] = [];
  const students: Student[] = [];
  const ppct: PPCTPlan[] = [];
  const department: DepartmentRecord[] = [];

  // Validate Tasks
  if (rawPayload.tasks !== undefined) {
    if (!Array.isArray(rawPayload.tasks)) {
      errors.push('Trường "tasks" phải là một mảng danh sách công việc.');
    } else {
      rawPayload.tasks.forEach((item, index) => {
        if (!item || typeof item !== 'object') {
          errors.push(`Task ở vị trí #${index + 1} không hợp lệ.`);
          return;
        }
        const t = item as Record<string, unknown>;
        const title = isValidString(t.title) ? t.title.trim() : '';
        if (!title) {
          errors.push(`Task #${index + 1} thiếu tiêu đề.`);
          return;
        }

        const validPriorities: Priority[] = ['HIGH', 'MEDIUM', 'LOW'];
        const priority = validPriorities.includes(t.priority as Priority)
          ? (t.priority as Priority)
          : 'MEDIUM';

        tasks.push({
          id: sanitizeId(t.id),
          title,
          dueDate: isValidString(t.dueDate) ? t.dueDate : new Date().toISOString().slice(0, 10),
          priority,
          completed: isValidBoolean(t.completed) ? t.completed : false,
          createdAt: sanitizeTimestamp(t.createdAt, now),
          updatedAt: sanitizeTimestamp(t.updatedAt, now),
        });
      });
    }
  }

  // Validate Prompts
  if (rawPayload.prompts !== undefined) {
    if (!Array.isArray(rawPayload.prompts)) {
      errors.push('Trường "prompts" phải là một mảng danh sách prompt.');
    } else {
      rawPayload.prompts.forEach((item, index) => {
        if (!item || typeof item !== 'object') {
          errors.push(`Prompt ở vị trí #${index + 1} không hợp lệ.`);
          return;
        }
        const p = item as Record<string, unknown>;
        const title = isValidString(p.title) ? p.title.trim() : '';
        const content = isValidString(p.content) ? p.content : '';

        if (!title || !content) {
          errors.push(`Prompt #${index + 1} thiếu tiêu đề hoặc nội dung.`);
          return;
        }

        prompts.push({
          id: sanitizeId(p.id),
          title,
          content,
          description: isValidString(p.description) ? p.description : '',
          category: isValidString(p.category) && p.category.trim() ? p.category.trim() : 'Giáo án',
          tags: isValidString(p.tags) ? p.tags : '',
          favorite: isValidBoolean(p.favorite) ? p.favorite : false,
          createdAt: sanitizeTimestamp(p.createdAt, now),
          updatedAt: sanitizeTimestamp(p.updatedAt, now),
        });
      });
    }
  }

  // Validate Docs
  if (rawPayload.docs !== undefined) {
    if (!Array.isArray(rawPayload.docs)) {
      errors.push('Trường "docs" phải là một mảng danh sách tài liệu.');
    } else {
      rawPayload.docs.forEach((item, index) => {
        if (!item || typeof item !== 'object') {
          errors.push(`Tài liệu ở vị trí #${index + 1} không hợp lệ.`);
          return;
        }
        const d = item as Record<string, unknown>;
        const title = isValidString(d.title) ? d.title.trim() : '';
        const url = isValidString(d.url) ? d.url.trim() : '';

        if (!title || !url) {
          errors.push(`Tài liệu #${index + 1} thiếu tên hoặc đường dẫn URL.`);
          return;
        }

        docs.push({
          id: sanitizeId(d.id),
          title,
          url,
          category: isValidString(d.category) && d.category.trim() ? d.category.trim() : 'Chuyên môn',
          description: isValidString(d.description) ? d.description : '',
          createdAt: sanitizeTimestamp(d.createdAt, now),
          updatedAt: sanitizeTimestamp(d.updatedAt, now),
        });
      });
    }
  }

  // Validate Journals
  if (rawPayload.journals !== undefined) {
    if (!Array.isArray(rawPayload.journals)) {
      errors.push('Trường "journals" phải là một mảng danh sách nhật ký.');
    } else {
      rawPayload.journals.forEach((item, index) => {
        if (!item || typeof item !== 'object') {
          errors.push(`Nhật ký ở vị trí #${index + 1} không hợp lệ.`);
          return;
        }
        const j = item as Record<string, unknown>;
        const title = isValidString(j.title) ? j.title.trim() : '';

        if (!title) {
          errors.push(`Nhật ký #${index + 1} thiếu tiêu đề.`);
          return;
        }

        journals.push({
          id: sanitizeId(j.id),
          date: isValidString(j.date) ? j.date : new Date().toISOString().slice(0, 10),
          title,
          category: isValidString(j.category) && j.category.trim() ? j.category.trim() : 'Chuyên môn',
          content: isValidString(j.content) ? j.content : '',
          conclusion: isValidString(j.conclusion) ? j.conclusion : '',
          notes: isValidString(j.notes) ? j.notes : '',
          createdAt: sanitizeTimestamp(j.createdAt, now),
          updatedAt: sanitizeTimestamp(j.updatedAt, now),
        });
      });
    }
  }

  // Validate Students
  if (rawPayload.students !== undefined) {
    if (!Array.isArray(rawPayload.students)) {
      errors.push('Trường "students" phải là một mảng danh sách học sinh.');
    } else {
      rawPayload.students.forEach((item, index) => {
        if (!item || typeof item !== 'object') {
          errors.push(`Học sinh ở vị trí #${index + 1} không hợp lệ.`);
          return;
        }
        const s = item as Record<string, unknown>;
        const name = isValidString(s.name) ? s.name.trim() : '';
        const className = isValidString(s.className) ? s.className.trim() : '';

        if (!name || !className) {
          errors.push(`Học sinh #${index + 1} thiếu họ tên hoặc lớp.`);
          return;
        }

        students.push({
          id: sanitizeId(s.id),
          name,
          className,
          gender: isValidString(s.gender) ? s.gender : 'Nam',
          level: isValidString(s.level) ? s.level : 'Khá',
          status: isValidString(s.status) ? s.status : 'Đang học',
          notes: isValidString(s.notes) ? s.notes : '',
          createdAt: sanitizeTimestamp(s.createdAt, now),
          updatedAt: sanitizeTimestamp(s.updatedAt, now),
        });
      });
    }
  }

  // Validate PPCT Plans
  if (rawPayload.ppct !== undefined) {
    if (!Array.isArray(rawPayload.ppct)) {
      errors.push('Trường "ppct" phải là một mảng kế hoạch phân phối chương trình.');
    } else {
      rawPayload.ppct.forEach((item, index) => {
        if (!item || typeof item !== 'object') {
          errors.push(`Kế hoạch PPCT ở vị trí #${index + 1} không hợp lệ.`);
          return;
        }
        const p = item as Record<string, unknown>;
        const title = isValidString(p.title) ? p.title.trim() : `Kế hoạch PPCT #${index + 1}`;
        const grade = (['10', '11', '12'].includes(p.grade as string)
          ? p.grade
          : '10') as GradeLevel;
        const track = (['GENERAL', 'ICT', 'CS'].includes(p.track as string)
          ? p.track
          : 'GENERAL') as TrackType;

        const lessons: PPCTLesson[] = [];
        if (Array.isArray(p.lessons)) {
          p.lessons.forEach((lItem, lIndex) => {
            if (!lItem || typeof lItem !== 'object') return;
            const l = lItem as Record<string, unknown>;
            const validStatus: LessonStatus[] = ['PENDING', 'COMPLETED', 'DELAYED', 'MAKEUP'];
            const status = validStatus.includes(l.status as LessonStatus)
              ? (l.status as LessonStatus)
              : 'PENDING';
            const validTypes: LessonType[] = [
              'LESSON',
              'PRACTICE',
              'MIDTERM',
              'FINAL',
              'REVIEW',
              'PROJECT',
            ];
            const type = validTypes.includes(l.type as LessonType)
              ? (l.type as LessonType)
              : 'LESSON';

            lessons.push({
              id: sanitizeId(l.id),
              order: isValidNumber(l.order) ? l.order : lIndex + 1,
              week: isValidNumber(l.week) ? l.week : Math.ceil((lIndex + 1) / 2),
              semester: l.semester === 2 ? 2 : 1,
              topic: isValidString(l.topic) ? l.topic : 'Chủ đề bài học',
              lessonName: isValidString(l.lessonName) ? l.lessonName : `Bài ${lIndex + 1}`,
              periods: isValidNumber(l.periods) ? l.periods : 1,
              type,
              status,
              scheduledDate: isValidString(l.scheduledDate) ? l.scheduledDate : undefined,
              completedDate: isValidString(l.completedDate) ? l.completedDate : undefined,
              notes: isValidString(l.notes) ? l.notes : undefined,
            });
          });
        }

        ppct.push({
          id: sanitizeId(p.id),
          title,
          grade,
          track,
          academicYear: isValidString(p.academicYear) ? p.academicYear : '2024 - 2025',
          assignedClasses: isValidString(p.assignedClasses) ? p.assignedClasses : '',
          totalPeriods: isValidNumber(p.totalPeriods) ? p.totalPeriods : lessons.length || 70,
          totalWeeks: isValidNumber(p.totalWeeks) ? p.totalWeeks : 35,
          isDefault: isValidBoolean(p.isDefault) ? p.isDefault : false,
          lessons,
          createdAt: sanitizeTimestamp(p.createdAt, now),
          updatedAt: sanitizeTimestamp(p.updatedAt, now),
        });
      });
    }
  }

  // Validate Department Records
  if (rawPayload.department !== undefined) {
    if (!Array.isArray(rawPayload.department)) {
      errors.push('Trường "department" phải là một mảng hồ sơ tổ chuyên môn.');
    } else {
      rawPayload.department.forEach((item, index) => {
        if (!item || typeof item !== 'object') {
          errors.push(`Hồ sơ tổ chuyên môn #${index + 1} không hợp lệ.`);
          return;
        }
        const d = item as Record<string, unknown>;
        const recordType = d.recordType;

        if (recordType === 'EVALUATION') {
          const validRatings: EvaluationRating[] = ['GIOI', 'KHA', 'DAT', 'CHUA_DAT'];
          const rating = validRatings.includes(d.rating as EvaluationRating)
            ? (d.rating as EvaluationRating)
            : 'KHA';

          const evaluation: LessonEvaluationRecord = {
            id: sanitizeId(d.id),
            recordType: 'EVALUATION',
            teacherName: isValidString(d.teacherName) ? d.teacherName : 'Giáo viên',
            observerName: isValidString(d.observerName) ? d.observerName : 'Người dự',
            className: isValidString(d.className) ? d.className : '10A1',
            lessonName: isValidString(d.lessonName) ? d.lessonName : 'Bài học',
            date: isValidString(d.date) ? d.date : new Date().toISOString().slice(0, 10),
            period: isValidNumber(d.period) ? d.period : 1,
            scorePlanning: isValidNumber(d.scorePlanning) ? d.scorePlanning : 4.0,
            scoreTeacherActivity: isValidNumber(d.scoreTeacherActivity) ? d.scoreTeacherActivity : 4.0,
            scoreStudentActivity: isValidNumber(d.scoreStudentActivity) ? d.scoreStudentActivity : 4.0,
            scoreEffectiveness: isValidNumber(d.scoreEffectiveness) ? d.scoreEffectiveness : 4.0,
            totalScore: isValidNumber(d.totalScore) ? d.totalScore : 16.0,
            rating,
            strengths: isValidString(d.strengths) ? d.strengths : '',
            weaknesses: isValidString(d.weaknesses) ? d.weaknesses : '',
            recommendations: isValidString(d.recommendations) ? d.recommendations : '',
            createdAt: sanitizeTimestamp(d.createdAt, now),
            updatedAt: sanitizeTimestamp(d.updatedAt, now),
          };
          department.push(evaluation);
        } else if (recordType === 'MEETING') {
          const validTopics: MeetingTopic[] = ['LESSON_STUDY', 'EXAM_MATRIX', 'SPECIALIZED_TOPIC', 'GENERAL'];
          const topic = validTopics.includes(d.topic as MeetingTopic)
            ? (d.topic as MeetingTopic)
            : 'GENERAL';

          const meeting: DepartmentMeetingRecord = {
            id: sanitizeId(d.id),
            recordType: 'MEETING',
            title: isValidString(d.title) ? d.title : 'Biên bản sinh hoạt tổ',
            date: isValidString(d.date) ? d.date : new Date().toISOString().slice(0, 10),
            time: isValidString(d.time) ? d.time : undefined,
            location: isValidString(d.location) ? d.location : undefined,
            chair: isValidString(d.chair) ? d.chair : 'Tổ trưởng',
            secretary: isValidString(d.secretary) ? d.secretary : 'Thư ký',
            attendees: isValidString(d.attendees) ? d.attendees : 'Toàn thể giáo viên trong tổ',
            absent: isValidString(d.absent) ? d.absent : undefined,
            topic,
            content: isValidString(d.content) ? d.content : '',
            resolutions: isValidString(d.resolutions) ? d.resolutions : '',
            assignments: isValidString(d.assignments) ? d.assignments : undefined,
            nextMeetingDate: isValidString(d.nextMeetingDate) ? d.nextMeetingDate : undefined,
            createdAt: sanitizeTimestamp(d.createdAt, now),
            updatedAt: sanitizeTimestamp(d.updatedAt, now),
          };
          department.push(meeting);
        } else if (recordType === 'ASSIGNMENT') {
          const assignment: TeacherAssignmentRecord = {
            id: sanitizeId(d.id),
            recordType: 'ASSIGNMENT',
            teacherName: isValidString(d.teacherName) ? d.teacherName : 'Giáo viên',
            email: isValidString(d.email) ? d.email : undefined,
            phone: isValidString(d.phone) ? d.phone : undefined,
            assignedClasses: isValidString(d.assignedClasses) ? d.assignedClasses : '',
            periodsPerWeek: isValidNumber(d.periodsPerWeek) ? d.periodsPerWeek : 17,
            labSchedule: isValidString(d.labSchedule) ? d.labSchedule : '',
            notes: isValidString(d.notes) ? d.notes : undefined,
            createdAt: sanitizeTimestamp(d.createdAt, now),
            updatedAt: sanitizeTimestamp(d.updatedAt, now),
          };
          department.push(assignment);
        }
      });
    }
  }

  const hasAnyData =
    tasks.length > 0 ||
    prompts.length > 0 ||
    docs.length > 0 ||
    journals.length > 0 ||
    students.length > 0 ||
    ppct.length > 0 ||
    department.length > 0;

  if (!hasAnyData && errors.length === 0) {
    const hasKeys =
      rawPayload.tasks !== undefined ||
      rawPayload.prompts !== undefined ||
      rawPayload.docs !== undefined ||
      rawPayload.journals !== undefined ||
      rawPayload.students !== undefined ||
      rawPayload.ppct !== undefined ||
      rawPayload.department !== undefined;

    if (!hasKeys) {
      errors.push('File sao lưu không chứa bất kỳ danh mục dữ liệu hợp lệ nào.');
    }
  }

  const isValid = errors.length === 0;

  const normalizedPayload: BackupPayload = {
    tasks,
    prompts,
    docs,
    journals,
    students,
    ppct,
    department,
    darkMode: isValidBoolean(rawPayload.darkMode) ? rawPayload.darkMode : undefined,
  };

  const backupData: BackupData = {
    app: 'TeacherHubPro',
    schemaVersion: 1,
    exportedAt,
    version,
    data: normalizedPayload,
  };

  return {
    isValid,
    data: isValid ? backupData : undefined,
    errors,
    summary: {
      tasks: tasks.length,
      prompts: prompts.length,
      docs: docs.length,
      journals: journals.length,
      students: students.length,
      ppct: ppct.length,
      department: department.length,
    },
  };
}
