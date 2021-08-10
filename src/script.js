var data = localStorage.getItem("questions");
var quesArr = [];

if(data){
    data = JSON.parse(data);
    var quesArr = [...data];
}
quesArr.push = function() { 
    Array.prototype.push.apply(this, arguments); 
    processQ();
};
quesArr.pop = function() {
    Array.prototype.pop.apply(this, arguments);
    processQ();
}

//console.log(quesArr)

function submitQuestion() {
    var question = document.getElementById("ques_topic").value;
    var ques_desc = document.getElementById("ques_ques").value;
    if(question != "" && ques_desc != "") {
        var quesObject = {
            Question: question,
            Description: ques_desc,
            Answers: []
        }
        quesArr.push(quesObject);
        localStorage.setItem("questions", JSON.stringify(quesArr));
    } else {
        alert("Please enter a Subject and your Question!");
    }
    
    document.getElementById("ques_topic").value = "";
    document.getElementById("ques_ques").value = "";  
    document.getElementById("ques_name").value = "";
}

function processQ() {
    removeQuestionList();
    updataQuestionList();
}

function removeQuestionList() {
    var question_list = document.getElementById("question-list");
    while(question_list.firstChild) {
        question_list.removeChild(question_list.firstChild);
    }
}

updataQuestionList();
function updataQuestionList() {
    quesArr.forEach((data, index)=> {
        var question = data.Question;
        var ques_desc = data.Description;

        var listNode = document.createElement("div");
        var head = document.createElement("h2");
        var questionTitle = document.createTextNode(question);
        head.appendChild(questionTitle);
        var desc = document.createElement("p");
        var questionDesc = document.createTextNode(ques_desc);
        desc.appendChild(questionDesc);
        listNode.appendChild(head);
        listNode.appendChild(questionDesc);
        listNode.classList.add("question_and_description");
        listNode.onclick = ()=> {
            changeColor(index);
            var answerList = document.querySelector(".answer_list");
            while(answerList.firstChild) {
                answerList.removeChild(answerList.firstChild);
            }
            openQuestion(index);
        }
        document.getElementById("question-list").appendChild(listNode);
    })
}

function changeColor(index) {
    var questionsList = document.querySelector("#question-list").children;
    quesArr.forEach((element, i)=> {
        if(i == index) {
            questionsList[i].style.color = "black";
        } else {
            questionsList[i].style.color = "gray";
        }
    })
}

function openQuestion(index) {
    document.getElementById("question-form").style.display="none";
    var page = document.getElementById("questions_and_answers");
    page.style.display="block";
    var object = quesArr[index];
    var question = page.querySelector(".question_and_description");
    question.querySelector("h2").innerText = object.Question;
    question.querySelector("span").innerText = object.Description;
    question.style.color = "black";
    question.style.border = "none";
    question.style.cursor = "default";

    var ansArr = object.Answers;
    ansArr.push = function() {
        Array.prototype.push.apply(this, arguments); 
        showResponses(index);
    }
    showResponses(index);
}

function showResponses(index) {
    var responseList = document.querySelector(".answer_list");
    var ansArr = quesArr[index].Answers;
    if(ansArr != null) {
        ansArr.forEach((element)=> {
            var name = element.Name;
            var arrAns = element.Answer;

            var listNode = document.createElement("div");
            var head = document.createElement("h2");
            var answererName = document.createTextNode(name);
            head.appendChild(answererName);
            var ans = document.createElement("p");
            var answer = document.createTextNode(arrAns);
            ans.appendChild(answer);
            listNode.appendChild(head);
            listNode.appendChild(ans);
            listNode.classList.add("name_and_answer");

            responseList.appendChild(listNode);
        })
    }
}

function submitAnswer(some) {
    var parent = some.parentElement.parentElement;
    var ques = [...parent.children].filter(node => node.className == "question_and_description")[0].querySelector("h2").innerText;
    var i;
    quesArr.forEach((element, index) => {
        if(element.Question === ques) {
            var name = parent.querySelector("input").value;
            var ans = parent.querySelector("textarea").value;
            if(name != "" && ans != "") {
                var ansObj = {
                    Name: name,
                    Answer: ans
                }
                element.Answers.push(ansObj);
                
            } else {
                alert("Please your Name and Answer!!");
            }
            i = index;
            parent.querySelector("input").value = "";
            parent.querySelector("textarea").value = "";
        }
    })
    var answerList = document.querySelector(".answer_list");
    while(answerList.firstChild) {
        answerList.removeChild(answerList.firstChild);
    }
    showResponses(i);
    localStorage.setItem("questions", JSON.stringify(quesArr));
}

function newQuestion() {
    var questionList = document.getElementById("question-list").children;
    quesArr.forEach((element, index)=> {
        questionList[index].style.color = "gray";
    })
    document.getElementById("questions_and_answers").style.display = "none";
    document.getElementById("question-form").style.display="block";
    removeQuestionList();
    updataQuestionList();
    document.getElementById("ques_name").value = "";
}

function removeQuestion(some) {
    var parent = some.parentElement.parentElement;
    var ques = [...parent.children].filter(node => node.className == "question_and_description")[0].querySelector("h2").innerText;
    var index;
    for(var i = 0; i < quesArr.length; i++) {
        if(quesArr[i].Question === ques) {
            index = i;
            break;
        }
    }
    quesArr.splice(index, 1);
    removeQuestionList();
    updataQuestionList();
    document.getElementById("questions_and_answers").style.display = "none";
    document.getElementById("question-form").style.display="block";
    document.getElementById("ques_name").value = "";
    localStorage.setItem("questions", JSON.stringify(quesArr));
}

function searchQuestion(element) {
    var query = element.value.toUpperCase();
    if(query == null) {
        removeQuestionList();
        updataQuestionList();
    } else {
        var question_list = document.getElementById("question-list");
        for(var i = 0; i < quesArr.length; i++) {
            a = quesArr[i].Question;
            txtValue = a;
            if (txtValue.toUpperCase().indexOf(query) > -1) {
                removeNoMatchFound();
                question_list.children[i].style.display = "";
            } else {
                question_list.children[i].style.display = "none";
            }
        }
        checkIfAnyElement();
    }
}

function checkIfAnyElement() {
    var question_list = document.getElementById("question-list");
    if(question_list.children[question_list.children.length - 1].className === "no_match_found") return;
    var itr = 0;
    for(; itr < question_list.children.length; itr++) {
        if(question_list.children[itr].style.display !== "none") {
            break;
        } 
    }    
    if(itr === question_list.children.length) {
        var newNode = document.createElement("h2");
        newNode.appendChild(document.createTextNode("No match found"));
        newNode.classList.add("no_match_found");
        question_list.appendChild(newNode);
    }
}

function removeNoMatchFound() {
    var question_list = document.getElementById("question-list");
    var toRemove = question_list.querySelector(".no_match_found");
    if(toRemove) {
        question_list.removeChild(toRemove);
    }
}