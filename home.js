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
popularProducts.innerHTML=popularNames.map(name=>menu.find(p=>p.name===name)).filter(Boolean).map(p=>`<article class="product"><button class="productOpen" type="button" onclick="openDish(${p.id})" aria-label="Подробнее: ${p.name}"><div class="pic">${dishPhoto(p,true)}</div><div class="productBody"><h3>${p.name}</h3><small>${p.weight||p.cat}</small></div></button><div class="priceRow"><span class="price">${money(p.price)}</span><button class="add" type="button" onclick="openDish(${p.id})">Подробнее</button></div></article>`).join('');
document.getElementById("aboutImages").innerHTML=["Пепперони","Филадельфия с сыром"].map(name=>`<div class="aboutImage">${dishPhoto(menu.find(p=>p.name===name),true)}</div>`).join("");
