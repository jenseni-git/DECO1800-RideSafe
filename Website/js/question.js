const locationNumber = getQueryVariable().locationNumber;
var correctTimes = getQueryVariable().correctTimes || 0;

class QuestionOption extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        let templateElem = document.getElementById('questionOption');
        let content = templateElem.content.cloneNode(true);
        content.querySelector('.content').innerText = this.getAttribute('description');
        if (this.getAttribute('selected')) {
            content.querySelector('.content').className = 'content selected';
        } else {
            content.querySelector('.content').className = 'content';
        }
        this.shadow.appendChild(content);
    }
    static get observedAttributes() {
        return ['selected'];
    }
    attributeChangedCallback() {
        if (this.getAttribute('selected')) {
            this.shadow.querySelector('.content').className = 'content selected';
        } else {
            this.shadow.querySelector('.content').className = 'content';
        }
    }
}
window.customElements.define('question-option', QuestionOption);

class Questions {
    constructor(list) {
        this.answerMap = new Map();
        this.curQuestionNumber = null;
        this.list = list || [
            {
                id: 'question_1',
                content:
                    'When riding a bike you must wear an Australian approved bicycle helmet?',
                options: ['True', 'False'],
                answer: "True",
            },
            {
                id: 'question_2',
                content:
                    'When riding at night you must have:',
                options: ['White headlight', 'Red tail-light', 'Red rear reflector', 'All of the above'],
                answer: "All of the above",
            },
            {
                id: 'question_3',
                content:
                    'The fine for failing to wear a helmet is:',
                options: ['$143', '$290', '$490', '$60'],
                answer: "$143",
            }, {
                id: 'question_4',
                content:
                    'Every time you ride your bike must have a bell, horn or other warning device.',
                options: ['True', 'False'],
                answer: "True",
            }, {
                id: 'question_5',
                content:
                    'You can tow a child in a bicycle trailer if:',
                options: ['You are 16 years or older', 'The child is under 10 years old and is correctly wearing an approved helmet', 'The bicycle trailer can safely carry the child', 'All of the above'],
                answer: "All of the above",
            }, {
                id: 'question_6',
                content:
                    'You must not hold onto a moving vehicle while riding a bicycle.',
                options: ['True', 'False'],
                answer: "True",
            }, {
                id: 'question_7',
                content:
                    'It is okay to lead an animal white riding a bicycle.',
                options: ['True', 'False'],
                answer: "False",
            }, {
                id: 'question_8',
                content:
                    'Bicycle riders who break road rules will be given the same fines as motorists.',
                options: ['True', 'False'],
                answer: "True",
            }, {
                id: 'question_9',
                content:
                    'Bicycle riders who break road rules will accumulate demerit points.',
                options: ['True', 'False'],
                answer: "$False",
            }, {
                id: 'question_10',
                content:
                    'While riding a bicycle on footpaths and shared paths you must:',
                options: ['Keep left and give way to all pedestrians', '$Always ride to the left of bicycle riders coming towards you', 'All of the above'],
                answer: "All of the above",
            }, {
                id: 'question_11',
                content:
                    'You cannot ride on a road or path where signs or road markings prohibit bicycles.',
                options: ['True', 'False'],
                answer: "True",
            }, {
                id: 'question_12',
                content:
                    "You don't have to give way to vehicles at uncontrolled intersections",
                options: ['True', 'False'],
                answer: "False",
            }, {
                id: 'question_13',
                content:
                    'You can ride across a pedestrian crossing at traffic lights if you:',
                options: ['Wait for the green "walk" sign', 'Proceed slowly and safely', 'Give way to pedestrians on the crossing', 'Keep to the left of any oncoming bicycle rider', 'All of the above'],
                answer: "All of the above",
            }, {
                id: 'question_14',
                content:
                    'Every time you ride, your bicycle must have at least one working brake.',
                options: ['True', 'False'],
                answer: "True",
            }, {
                id: 'question_15',
                content:
                    'When following a vehicle for more than 200m, how many metres distance should you keep between yourself and the vehicle?',
                options: ['1m', '1.5m', '2m'],
                answer: "2m",
            },
        ];

    }

    changeQuestion(number) {
        if (number == null) {
            number = this.curQuestionNumber || 0;
            if (number != 3) {
                number++;
            }
        }
        const question = this.list[number - 1];
        if (this.curQuestionNumber) {
            const isSelected = Array.from($('#question .question-options').children()).some(child => {
                if (child.getAttribute('selected')) {
                    const cur = this.list[this.curQuestionNumber - 1];
                    const selectedAnswer = cur.options[child.getAttribute("index")];
                    if (cur.answer == selectedAnswer) {
                        correctTimes = Number(correctTimes);
                        correctTimes += 1;
                        location.href = `Answer_true.html?questionNumber=${this.curQuestionNumber}&locationNumber=${locationNumber}&correctTimes=${correctTimes}`;
                    } else {
                        location.href = `Answer_false.html?questionNumber=${this.curQuestionNumber}&locationNumber=${locationNumber}&correctTimes=${correctTimes}`;
                    }
                }
                return child.getAttribute('selected');
            });
            if (!isSelected) {
                alert('Please select the answer');
            }
            return;
        }
        this.curQuestionNumber = number;
        $('.banner-pagination .current').text(`${number}`);
        $('.banner-pagination .total').text(`/3`);
        $('#question .question-total').text(`${number}/${this.list.length}`);
        $('#question .question-content').text(question.content);
        $('#question .question-options').empty();
        question.options.forEach((item, _index) => {
            let elStr = `<question-option index='${_index}' description="${item}"></question-option>`;
            $('#question .question-options').append(elStr);
        });
    }

    selectOption(index) {
        Array.from($('#question .question-options').children()).forEach(item => {
            item.removeAttribute('selected');
        });
        $('#question .question-options').children()[index].setAttribute('selected', true);
    }

    changeProgressBar(number) {
        let width = (number / 3) * 100;
        $('.fill').width(width + '%');
    }

    skipQuestion(number) {
        if (number == null) {
            number = this.curQuestionNumber || 0;
            if (number != 3) {
                number++;
            }
        }
        const question = this.list[number - 1];
        if (this.curQuestionNumber) {
            const cur = this.list[this.curQuestionNumber - 1];
            location.href = `Answer_false.html?questionNumber=${this.curQuestionNumber}&locationNumber=${locationNumber}&correctTimes=${correctTimes}`;
        }
        this.curQuestionNumber = number;
        $('.banner-pagination .current').text(`${number}`);
        $('.banner-pagination .total').text(`/${this.list.length}`);
        $('#question .question-total').text(`${number}/${this.list.length}`);
        $('#question .question-content').text(question.content);
        $('#question .question-options').empty();
        question.options.forEach((item, _index) => {
            let elStr = `<question-option index='${_index}' description="${item}"></question-option>`;
            $('#question .question-options').append(elStr);
        });
    }
}

// reference this method from https://blog.csdn.net/luck_yangl/article/details/102665737
function getQueryVariable() {
    let href = window.location.href;
    let query = href.substring(href.indexOf('?') + 1);
    let vars = query.split('&');
    let obj = {};
    for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        obj[pair[0]] = pair[1];
    }
    return obj;
}

$(function () {
    const questions = new Questions();
    const urlParams = getQueryVariable();

    let ajaxInputBikePath = {
        resource_id: "cb86bda2-ad56-46d5-bd7d-305f5e3cbecb",
        limit: 1000000,
    };

    $.ajax({
        url: "https://www.data.brisbane.qld.gov.au/data/api/3/action/datastore_search",
        data: ajaxInputBikePath,
        dataType: "jsonp",
        cache: true,
        success: function (results) {
            console.log(locationNumber);
            $.each(results.result.records, function (recordID, recordValue) {
                if (locationNumber == recordValue._id) {
                    let questionType = recordValue.SECTION_TYPES_DESCRIPTION;
                    if (questionType == 'ASPHALT') {
                        questions.list = questions.list.slice(0, 3);
                    } else if (questionType == 'CONCRETE') {
                        questions.list = questions.list.slice(3, 6);
                    } else if (questionType == 'BLOCK PAVING') {
                        questions.list = questions.list.slice(6, 9);
                    } else if (questionType == 'EXPOSED AGGREGATE') {
                        questions.list = questions.list.slice(9, 12);
                    } else if (questionType == 'TIMBER') {
                        questions.list = questions.list.slice(12);
                    }
                    if (urlParams.questionNumber != null) {
                        questions.changeQuestion(Number(urlParams.questionNumber));
                        questions.changeProgressBar(Number(urlParams.questionNumber));
                    } else {
                        questions.changeQuestion(1);
                        questions.changeProgressBar(1);
                    }
                    $('.submit-btn').click(e => {
                        questions.changeQuestion();
                    });
                    $('.skip-btn').click(e => {
                        questions.skipQuestion();
                    });
                    $('#question .question-options').click(e => {
                        const index = e.target.getAttribute('index');
                        if (index != null) {
                            questions.selectOption(Number(index));
                        }
                    });
                }
            });
        },
    });
});