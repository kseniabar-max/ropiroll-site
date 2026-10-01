function selectCategory(category) {
  filterCat(category);
  document.querySelectorAll('[data-category]').forEach(el => el.classList.toggle('selected', el.dataset.category === category));
}
const categoryDefinitions = [
  ['Пицца','Пицца','Пепперони'],['Роллы','Роллы','Филадельфия с сыром'],
  ['Сеты','Сеты','Сет на вечер'],['Салаты','Салаты','Цезарь с курицей'],
  ['Фритюр','Фритюр','Картофель фри'],['Шаурма','Шаурма','Шаурма сырная']
];
categoryCards.innerHTML = categoryDefinitions.map(([label,cat,name], index) => {
  return `<a href="#menu" class="categoryCard" data-category="${cat}" onclick="selectCategory('${cat}')"><div class="categoryPhoto categoryIllustration categoryIllustration${index}" role="img" aria-label="${label}"></div><span>${label}</span></a>`;
}).join('');
const popularNames=['Пепперони','Филадельфия с сыром','Унаги хот','Пицца 4 сыра','Сет на вечер','Цезарь с курицей'];
popularProducts.innerHTML=popularNames.map(name=>menu.find(p=>p.name===name)).filter(Boolean).map(p=>`<article class="product"><button class="productOpen" type="button" onclick="openDish(${p.id})" aria-label="Подробнее: ${p.name}"><div class="pic">${dishPhoto(p,true)}</div><div class="productBody"><h3>${p.name}</h3><small>${p.weight||p.cat}</small></div></button><div class="priceRow"><span class="price">${money(p.price)}</span><button class="add" type="button" onclick="add(${p.id})" aria-label="Добавить ${p.name} в корзину">В корзину</button></div></article>`).join('');
document.getElementById('deliveryAddressForm').addEventListener('submit', e=>{
  e.preventDefault();
  const address=document.getElementById('deliveryAddress').value.trim();
  if(!address)return;
  document.querySelector('#orderForm [name="address"]').value=address;
  const result=document.getElementById('deliveryResult');
  result.hidden=false;result.replaceChildren();
  const copy=document.createElement('span');
  copy.textContent=`Адрес: ${address}. Доставка от 350 ₽, бесплатно при заказе от 2 000 ₽ в пределах 10 км. Точный тариф по маршруту подтвердит администратор. `;
  const link=document.createElement('a');link.href=document.querySelector('footer address a').getAttribute('href');link.textContent='Уточнить стоимость';
  result.append(copy,link);
});

document.getElementById("aboutImages").innerHTML=["Пепперони","Филадельфия с сыром"].map(name=>`<div class="aboutImage">${dishPhoto(menu.find(p=>p.name===name),true)}</div>`).join("");
