import React from 'react';
import PagePlaceholder from '../../components/dev/PagePlaceholder';

export default function LecturePlayer() {
  return <PagePlaceholder routePath="/learn/:courseId/lesson/:id" owner="M4 — LMS Player & Assessment Engine" screenshots={['lecture.png']} />;
}
