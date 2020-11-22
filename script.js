const bio = document.querySelector('.bio');
const tbio = document.querySelector('.tbio');
const user = document.querySelector('.user');
const menu = document.querySelector('.breadcrum');
const liImg = document.querySelector('li.img img');
const name = document.querySelector('.name__full');
const emoji = document.querySelector('.emoji__img');
const tname = document.querySelector('.tname__full');
const temoji = document.querySelector('.temoji__img');
const repoList = document.querySelector('.repo__list');
const emojiTxt = document.querySelector('.emoji__txt');
const temojiTxt = document.querySelector('.temoji__txt');
const userName = document.querySelector('.name__username');
const profileImg = document.querySelector('.profile__img');
const tprofileImg = document.querySelector('.tprofile__img');
const tuserName = document.querySelector('.tname__username');
const menuList = document.querySelector('.nav__small__bottom');
const repoCount = document.querySelector('.topbar__item__count');
const mainBody = document.querySelector('.mainbody');
const spinner = document.querySelector('.spinner');

menu.addEventListener('click', () => {
  menuList.classList.toggle('hide');
});

const encrypt = (text, shift) => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    let c = text.charCodeAt(i);
    if (c >= 65 && c <= 90) {
      result += String.fromCharCode(((c - 65 + shift) % 26) + 65);
    } else if (c >= 97 && c <= 122) {
      result += String.fromCharCode(((c - 97 + shift) % 26) + 97);
    } else {
      result += text.charAt(i);
    }
  }
  return result;
};

const decrypt = (text, shift) => {
  return encrypt(text, (26 - shift) % 26);
};

const getData = async () => {
  /**
   * Have to decrypt github access token because
   * github will invalidate the token if commited
   * to the repo in raw form
   */
  const token = decrypt('8npp28p7n653qo567q9n96qr410q138s8o971140', 13);

  const gql = {
    query:
      '{\n  user(login: "cokoghenun") {\n    bio\n    avatarUrl\n    name\n    login\n   status {\n      message\n      emojiHTML\n    }\n    repositories(orderBy: {field: CREATED_AT, direction: DESC}, first: 20) {\n      totalCount\n      nodes {\n        name\n        url\n        description\n        primaryLanguage {\n          color\n          name\n        }\n        stargazers {\n          totalCount\n        }\n      }\n    }\n  }\n}\n',
    variables: {},
  };

  const res = await fetch('https://api.github.com/graphql', {
    mode: 'cors',
    method: 'POST',
    body: JSON.stringify(gql),
    headers: {
      Authorization: `bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => res.data.user)
    .catch((error) => {
      console.error(error);
    });

  bio.innerHTML = res.bio;
  user.src = res.avatarUrl;
  tbio.innerHTML = res.bio;
  liImg.src = res.avatarUrl;
  name.innerHTML = res.name;
  tname.innerHTML = res.name;
  userName.innerHTML = res.login;
  profileImg.src = res.avatarUrl;
  tprofileImg.src = res.avatarUrl;
  tuserName.innerHTML = res.login;
  emojiTxt.innerHTML = res.status.message;
  temojiTxt.innerHTML = res.status.message;
  repoCount.innerHTML = res.repositories.totalCount;
  emoji.innerHTML = res.status.emojiHTML.replace('/', '');
  temoji.innerHTML = res.status.emojiHTML.replace('/', '');

  repoList.innerHTML = res.repositories.nodes
    .map(({ url, name, description, primaryLanguage, stargazers }) => {
      return `<div class="repo__item">
      <div class="repo__item__left">
        <div class="repo__item__name">
          <a href="${url}" target="_blank">
            ${name}
            </a>
          </div>
        <div class="repo__item__desc">
          ${description}
        </div>
        <div class="repo__item__stats">
          <div class="repo__item__lang">
            <span class="dot dot--yellow" style="background-color: ${primaryLanguage?.color}"></span>
            <span class="repo__item__lang__text"> ${primaryLanguage?.name}</span>
          </div>
          <div class="repo__item__stars">
            <img src="icons/star.svg" alt="star" />
            <span>${stargazers?.totalCount}</span>
          </div>
          <div class="repo__item__upate">Updated 13 days ago</div>
        </div>
      </div>
      <div class="repo__item__right">
        <button>
          <img src="icons/star.svg" alt="star" />
          <span>Star</span>
        </button>
      </div>
    </div>`;
    })
    .join('');

  spinner.classList.add('hide');
  mainBody.classList.remove('hide');
};

getData();
