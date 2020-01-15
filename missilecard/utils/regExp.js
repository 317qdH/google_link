const verifyFactory = {
  isNull(value) {
    return value
  },
  name(value) {
    var reg = /^[\(\)\.\{0,}\u4e00-\u9fa5]+$/;
    return reg.test(value) && value.length < 46
  },
  phone(value) {
    // console.log(value);
    let mobileTest = /^1\d{10}$/;
    let phoneTest = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
    // console.log('手机号',mobileTest.test(value), phoneTest.test(value));
    return mobileTest.test(value) || phoneTest.test(value)
  }
}
module.exports ={
  verifyFactory
}