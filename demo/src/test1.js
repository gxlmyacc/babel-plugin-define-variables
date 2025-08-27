function test() {
  console.log('__filename__', __filename__);
  console.log('__filehash__', __filehash__);
  console.log('__dirname__', __dirname__);
  console.log('__now__', __now__);
  console.log('__timestamp__', __timestamp__);
  console.log('__packagename__', __packagename__);
  console.log('__packageversion__', __packageversion__);
  console.log('__packageversion__', __packageversion__(''));
  console.log('__packageversion__', __packageversion__('@babel/cli'));
  console.log('process.env.BUILD_ENV', process.env.BUILD_ENV);
  __packageversion__.split('.');
}


export default test;
