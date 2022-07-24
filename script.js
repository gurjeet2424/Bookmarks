const showModal = document.getElementById('show-modal');
const closeModal = document.getElementById('close-modal');
const modal = document.getElementById('modal');
const websiteName = document.getElementById('website-name');
const websiteUrl = document.getElementById('website-url');
const bookmarkForm = document.getElementById('bookmark-form');
const bookmarkContainer = document.getElementById('bookmark-container');

let bookmarkArray = [];

 function modalShow(){
     modal.classList.add('show-modal');
     websiteName.focus();
}

function validate(nameEl, urlEl){
    var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    var regex = new RegExp(expression);
    if((!nameEl) || (!urlEl)){
        alert('Please fill both the form elements');
        return false;
    }
    if(!urlEl.match(regex)){
        alert('Please enter valid web address.');
        return false;
    }
    return true;
}

function buildBookmarks(){
    bookmarkContainer.textContent = '';
    bookmarkArray.forEach((book) => {
        const {Name, URL} = book;
        const item = document.createElement('div');
        item.classList.add('item');
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid', 'fa-xmark');
        closeIcon.setAttribute('title','Delete Bookmark');
        closeIcon.setAttribute('onclick', `deletebookmark('${URL}')`);
        const linkinfo = document.createElement('div');
        linkinfo.classList.add('name');
        const favicon = document.createElement('img');
        favicon.setAttribute('src',`https://s2.googleusercontent.com/s2/favicons?domain=${URL}`);
        favicon.setAttribute('alt', 'Favicon');
        const link = document.createElement('a');
        link.setAttribute('href', `${URL}`);
        link.setAttribute('target','_blank');
        link.textContent = Name;
        linkinfo.append(favicon, link);
        item.append(closeIcon, linkinfo);
        bookmarkContainer.appendChild(item);

    });
}

function fetchBookmarks(){
    if(localStorage.getItem('bookmark')){
        bookmarkArray = JSON.parse(localStorage.getItem('bookmark'));
    } else{
        bookmarkArray = [
            {
                Name : 'Google',
                URL : 'https://google.com',
            },
        ];
        localStorage.setItem('bookmark', JSON.stringify(bookmarkArray));
    }
    buildBookmarks();

}

function deletebookmark(URL){
    bookmarkArray.forEach((book,i) => {
        if(book.URL === URL){
            bookmarkArray.splice(i,1);
        }
    });
    localStorage.setItem('bookmark', JSON.stringify(bookmarkArray));
    fetchBookmarks();
}

function updateForm(e){
     e.preventDefault();
     const nameEl = websiteName.value;
     let urlEl = websiteUrl.value;
     if(!urlEl.includes("http://") && (!urlEl.includes("https://"))){
         urlEl = `https://${urlEl}`;
     }
     if(!validate(nameEl,urlEl)){
         return false;
     }

     const bookmarkObj = {
         Name : nameEl,
         URL : urlEl,
     };
     bookmarkArray.push(bookmarkObj);
     localStorage.setItem('bookmark', JSON.stringify(bookmarkArray));
     fetchBookmarks();
     bookmarkForm.reset();
     websiteName.focus();
     
}

showModal.addEventListener('click', modalShow);
closeModal.addEventListener('click', () => {
    modal.classList.remove('show-modal')
});
window.addEventListener('click', (e) => {(e.target === modal) ? modal.classList.remove('show-modal') : false});
bookmarkForm.addEventListener('submit', updateForm);

fetchBookmarks();