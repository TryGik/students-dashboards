// let name = 'ahutin';
// let nameArr = name.split(' ');
// let newArr = [];
// nameArr.map(item => {
//     if(item !== '') {
//         item.trim();
//         let newItem = item.replace(item[0], item[0].toUpperCase());
//         newArr.push(newItem);
//     }
// })

// console.log(newArr.join(' '))
// let date = '2016-09-01';
// let monthNameArray = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
// let dateArr = date.split('-');

// let year = dateArr[0] + 'г.';
// let month = dateArr[1];
// let day = dateArr[2];
// let monthName;
// let patternDateArr = [];
// if (month[0] == 0) {
//     monthName = monthNameArray[month[1] - 1];
// } else monthName = monthNameArray[month - 1];

// patternDateArr.push(day, monthName, year);
// let patternDate = patternDateArr.join(' ')                   
// console.log(patternDate);
// console.log(date);

// let currentDay = Date.now();
// let targetDay = new Date(dateArr[0], dateArr[1], dateArr[2])
// let dif = Math.ceil((currentDay - targetDay.getTime())/1000/60/60/24/365);
// dif > 5 ? console.log('graduate') : console.log(dif)


//Поиск

let students = ['Алексей', 'Антуан', 'Николай', 'Анатолий'];
const container = document.querySelector('.container');

function show(students) {
    students.forEach((item) => {
        let div = document.createElement('div');
        div.classList.add('name')
        div.textContent = item;
        container.append(div);
    })
}
show(students);

function hide() {
    let div = document.querySelectorAll('.name');
    div.forEach(el => el.remove());
}

function sortArray(students, key) {
        let mapped = students.filter((item, i) => {
            if (item.includes(key)) {
                return {
                    index: i,
                    value: item,
                };
            }
        })

        mapped.sort((a, b) => {
            if (a > b) {
                return 1;
            }
            if (a < b) {
                return -1;
            }
            return 0;
        });

        let result = mapped.concat(students);;
        let setResult = new Set(result)
        return Array.from(setResult);
}


const input = document.querySelector('.input');
const btn = document.querySelector('.btn');
btn.addEventListener('click', (e) => {
    console.log(input.value)
    e.preventDefault();
    let result = 0;
    for (let i = 0; i < students.length; i++) {
        if (students[i].includes(input.value)) {
            result++
        }
    }
    if (result > 0 && input.value !== '') {
        hide();
        show(sortArray(students, input.value));
        console.log('1')
    } else if (result === 0 || input.value == '') {
        hide();
        show(students);
        console.log('2')
    }
})