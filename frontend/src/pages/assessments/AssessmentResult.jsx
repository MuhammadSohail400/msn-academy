import React from 'react';
import PagePlaceholder from '../../components/dev/PagePlaceholder';

export default function AssessmentResult() {
  return <PagePlaceholder routePath="/learn/:courseId/assessment/result" owner="M4 — Assessment Engine" screenshots={['assessment pass.png', 'assessment fail.png']} />;
}
