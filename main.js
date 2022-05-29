//Validator
const validation = new JustValidate('.form');

validation
    .addField('#name', [
        {
            rule: 'required',
            errorMessage: 'Как вас зовут?',
        },
        {
            rule: 'minLength',
            value: 2,
            errorMessage: 'ФИО должно содержать не менее 2х символов!',
        },
        {
            rule: 'maxLength',
            value: 70,
            errorMessage: 'ФИО не должно содержать более 70 символов!',
        },
    ])
    .addField('#faculty', [
        {
            rule: 'required',
            errorMessage: 'Ваш факультет?',
        },
        {
            rule: 'minLength',
            value: 3,
            errorMessage: 'Факультет должен содержать не менее 2х символов!',
        },
        {
            rule: 'maxLength',
            value: 15,
            errorMessage: 'Факультет не должен содержать более 15 символов!',
        },
    ])
    .addField('#dateBirth', [
        {
            plugin: window.JustValidatePluginDate((fields) => ({
                isAfter: '1945-05-09',
                isBefore: `${new Date().getFullYear() - 14}-01-01`,
            })),
            errorMessage: 'Укажите коректную дату рождения',
        },
    ])
    .addField('#dateEdu', [
        {
            plugin: window.JustValidatePluginDate((fields) => ({
                isAfter: '2000-09-01',
                isBefore: `${new Date().getFullYear()}-09-01`,
            })),
            errorMessage: 'Укажите коректную дату начала обучения',
        },
    ]);

//Main Application

let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

const container = document.querySelector('.app');
const fullName = document.querySelector('.input-name');
const faculty = document.querySelector('.input-faculty');
const birthDate = document.querySelector('.input-date');
const educationPeriod = document.querySelector('.input-education');
const btnAddStudent = document.querySelector('.btn');

//отображение таблици

function showElements() {
    students.forEach(item => {
        createTableElements(item.fullName, item.faculty, item.birthDate, item.educationPeriod);
    })
}
showElements()

function clearField() {
    let elem = document.querySelectorAll('.table-students')
    elem.forEach(item => item.style = 'display: none;')
}


//создание таблици

function createTableElements(fullName, faculty, birthDate, educationPeriod) {
    const table = document.createElement('div');
    table.classList.add('table', 'table-students');
    container.append(table);

    const fullNameDiv = document.createElement('div');
    const facultyDiv = document.createElement('div');
    const birthDateDiv = document.createElement('div');
    const educationPeriodDiv = document.createElement('div');
    fullNameDiv.textContent = fullName;
    facultyDiv.textContent = faculty;
    birthDateDiv.textContent = birthDate.patternDate;
    educationPeriodDiv.textContent = educationPeriod.patternDate + `(${educationPeriod.course})`;

    fullNameDiv.classList.add('table__item');
    facultyDiv.classList.add('table__item');
    birthDateDiv.classList.add('table__item');
    educationPeriodDiv.classList.add('table__item');
    table.append(fullNameDiv);
    table.append(facultyDiv);
    table.append(birthDateDiv);
    table.append(educationPeriodDiv);
}


//трансформация данных

function transformationName(name) {
    let nameArr = name.split(' ');
    let newArr = [];
    nameArr.map(item => {
        if (item !== '') {
            item.trim();
            let newItem = item.replace(item[0], item[0].toUpperCase());
            newArr.push(newItem);
        }
    })
    return newArr.join(' ');
}

function transformationDate(date) {
    let monthNameArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    let dateArr = date.split('-');

    let year = dateArr[0] + 'г.';
    let month = dateArr[1];
    let day = dateArr[2];
    let monthName, course;
    let patternDateArr = [];
    if (month[0] == 0) {
        monthName = monthNameArray[month[1] - 1];
    } else monthName = monthNameArray[month - 1];

    patternDateArr.push(day, monthName, year);
    let patternDate = patternDateArr.join(' ');

    let currentDay = Date.now();
    let targetDay = new Date(dateArr[0], dateArr[1], dateArr[2]);
    let dif = Math.ceil((currentDay - targetDay.getTime()) / 1000 / 60 / 60 / 24 / 365);
    dif > 5 ? course = 'окончил(а)' : course = dif + 'курс';
    return {
        patternDate,
        course,
        date
    }
}


//добавление студентов

btnAddStudent.addEventListener('click', (e) => {
    if (validation.isValid) {
        e.preventDefault();
        let fullNameItem = transformationName(fullName.value);
        let facultyItem = transformationName(faculty.value);
        let birthDateItem = transformationDate(birthDate.value);
        let educationPeriodItem = transformationDate(educationPeriod.value);


        let studentInfo = {};
        studentInfo.fullName = fullNameItem;
        studentInfo.faculty = facultyItem;
        studentInfo.birthDate = birthDateItem;
        studentInfo.educationPeriod = educationPeriodItem;
        students.push(studentInfo);
        localStorage.setItem('students', JSON.stringify(students));

        createTableElements(fullNameItem, facultyItem, birthDateItem, educationPeriodItem);
        let inputAria = document.querySelectorAll('.input');
        inputAria.forEach(item => item.value = '');
        validation.isValid = false;
    }
})


//Сортировка

function sortStudent(arr, key) {
    arr.sort((a, b) => {
        if (a[key] > b[key]) {
            return 1;
        }
        if (a[key] < b[key]) {
            return -1;
        }
        // a должно быть равным b
        return 0;
    })
}

const sortFullName = document.querySelector('.table__name');
const sortFaculty = document.querySelector('.table__faculty');
const sortDataBirth = document.querySelector('.table__date');
const sortDataEdu = document.querySelector('.table__education');

sortFullName.addEventListener('click', () => {
    clearField();
    localStorage.clear();
    sortStudent(students, 'fullName');
    localStorage.setItem('students', JSON.stringify(students));
    showElements();
});
sortFaculty.addEventListener('click', () => {
    clearField();
    localStorage.clear();
    sortStudent(students, 'faculty');
    localStorage.setItem('students', JSON.stringify(students));
    showElements();    
});

sortDataBirth.addEventListener('click', () => {
    clearField();
    localStorage.clear();
    students.sort((a,b) => {
        if (a.birthDate.date > b.birthDate.date) {
            return 1;
        }
        if (a.birthDate.date < b.birthDate.date) {
            return -1;
        }
        return 0;    
    })
    localStorage.setItem('students', JSON.stringify(students));
    showElements()    
});
sortDataEdu.addEventListener('click', () => {
    clearField();
    localStorage.clear();
    students.sort((a,b) => {
        if (a.educationPeriod.date > b.educationPeriod.date) {
            return 1;
        }
        if (a.educationPeriod.date < b.educationPeriod.date) {
            return -1;
        }
        return 0;    
    })
    localStorage.setItem('students', JSON.stringify(students));
    showElements();    
});

//Поиск
const searchInput = document.querySelector('.search');
const searchBtn = document.querySelector('.btn__search');

function SearchSubStr(students, key) {
    let mapped = students.filter((item, i) => {
        if (item.fullName.includes(key)) {
            return {
                index: i,
                value: item,
            };
        }
    })

    mapped.sort((a, b) => {
        if (a.fullName > b.fullName) {
            return 1;
        }
        if (a.fullName < b.fullName) {
            return -1;
        }
        return 0;
    });

    let result = mapped.concat(students);;
    let setResult = new Set(result)
    return Array.from(setResult);
}

searchBtn.addEventListener('click', (e) => {
    console.log(searchInput.value)
    e.preventDefault();
    let result = 0;
    let newStudentList = students;
    clearField();
    localStorage.clear();
    for (let i = 0; i < newStudentList.length; i++) {
        if (newStudentList[i].fullName.includes(searchInput.value)) {
            result++
        }
    }
    if (result > 0 && searchInput.value !== '') {
        localStorage.setItem('students', JSON.stringify(SearchSubStr(newStudentList, searchInput.value)));
        SearchSubStr(newStudentList, searchInput.value).forEach(item => {
            createTableElements(item.fullName, item.faculty, item.birthDate, item.educationPeriod);
        })

     
    } else if (result === 0 || searchInput.value == '') {
        localStorage.setItem('students', JSON.stringify(newStudentList));
        newStudentList.forEach(item => {
            createTableElements(item.fullName, item.faculty, item.birthDate, item.educationPeriod);
        })
    }
    searchInput.value = '';
    localStorage.setItem('students', JSON.stringify(students));
})



















