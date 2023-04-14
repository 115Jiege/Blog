hexo.extend.helper.register('arkIcon', function () {
  var icon = [
      '#icon-fruit-icons-1',
      '#icon-fruit-icons-2',
      '#icon-fruit-icons-3',
      '#icon-fruit-icons-4',
      '#icon-fruit-icons-5',
      '#icon-fruit-icons-6',
      '#icon-fruit-icons-7',
      '#icon-fruit-icons-8',
      '#icon-Kiwifruit',
      '#icon-fruitice',
      '#icon-FruitsGeneralAgeneral',
      '#icon-xigua',
      '#icon-boluo',
      '#icon-xiangjiao'
   ]
  var index = Math.floor(Math.random()*icon.length);
  return icon[index]
});
