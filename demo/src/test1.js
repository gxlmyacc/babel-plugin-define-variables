function test() {
  console.log('__filename', __filename);
  console.log('__dirname', __dirname);
  console.log('__now', __now);
  console.log('__timestamp', __timestamp);
  console.log('__packagename', __packagename);
  console.log('__packageversion', __packageversion);
  console.log('__packageversion', __packageversion(''));
  console.log('__packageversion', __packageversion('@babel/cli'));
  console.log('process.env.BUILD_ENV', process.env.BUILD_ENV);
}


export default test;