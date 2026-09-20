const mongoose = require('mongoose');

const uri = 'mongodb+srv://msohailg211_db_user:j1Ag07qBtshAAyzB@cluster0.4rhocfr.mongodb.net/msn_academy';

async function main() {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const users = await mongoose.connection.db.collection('users').find({ email: 'student.phase3@msnacademy.pk' }).toArray();
  if (!users.length) {
    console.log('User not found');
    process.exit(0);
  }

  const userId = users[0]._id;
  const enrollments = await mongoose.connection.db.collection('enrollments').find({ userId }).toArray();
  console.log('Found enrollments:', enrollments.length);

  for (const e of enrollments) {
    console.log('Before update - courseId:', e.courseId, 'progress:', e.progressPercentage, 'assessmentStatus:', e.assessmentStatus);
    await mongoose.connection.db.collection('enrollments').updateOne(
      { _id: e._id },
      { $set: { progressPercentage: 100, assessmentStatus: 'ELIGIBLE' } }
    );
    console.log('Updated enrollment to 100% progress and ELIGIBLE for course:', e.courseId);
  }

  console.log('Done!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
