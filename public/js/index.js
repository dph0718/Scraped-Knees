$(document).click(() =>
    console.log("clicked"));

//dummy user data to be replaced by authentication
const user = {
    name: "Elephant, Jr.",
    id: "B6708",
    date: Date.now(),
}

//attaches click handling to button element ($button) to fetch comment by id (id)
//call this function on each delete button in the function that renders it.
function deleteClick($button, articleId, commentId) {
    $button.click(function () {
        console.log('articleId:', articleId);
        console.log('commentId:', commentId);
        $.ajax(`/article/${articleId}&${commentId}`, {
            type: "DELETE",
            success: data => {
                console.log(data);
            }
        })
            .then(results => {
                $(".commentry").hide();
                getAllComments(articleId)
                    .then(data => {
                        console.log("getAllComments done");
                        popComments(data, articleId)
                    });
            })
    })
};

//Promise for getting all comments associated with article (articleId). Returns array of comments.
function getAllComments(articleId) {
    return new Promise((res, err) => {
        $.get("/comment/" + articleId)
            .then(data => {
                let commentArray = [];
                data[0].comments.forEach((e, i) => {
                    commentArray.push(e);
                })
                $(`.comments-length[data-id=${articleId}]`)
                    .text(`${commentArray.length}`);
                console.log(`trying to put a number!${commentArray.length}`)
                res(commentArray);
            })
    })
}

//renders the comments from array (array), attaches them to an element($that)
function popComments(array, articleId) {
    let $commentBox = $(`.comments-container[data-id=${articleId}]`);
    let numComments = array.length;
    console.log('#comments:', numComments);


    array.forEach(e => {
        let commentor = e.author;
        let articleId = e.article[0];
        let $newComment = $(`<p class='commentry'>${commentor} said: </br>
        "${e.comment}"</p>`);
        if (e.authorId == user.id) {
            commentor = "You";
            $newComment = $(`<p class='commentry'>${commentor} said: </br>
        "${e.comment}"</p>`);
            $newComment
                .append(`<button class="delete" data-article="${e.article[0]}" data-id="${e._id}">Delete</button>`);
        }
        $commentBox
            .after($newComment);
        deleteClick($newComment, articleId, e._id);
    })
};

//click handler: shows all comments of the article;
$(".show-comments").click(function () {
    let id = $(this).data('id');
    let that = this;
    let $that = $(this);
    if (that.shown == undefined) {
        that.shown = false;
        that.fetched = false;
    }
    let numOfComments;
    if (that.shown == false) {
        $that.text('Hide Comments');

        getAllComments(id)
            .then(data => {
                console.log("getAllComments done");
                popComments(data, id)
                that.numOfComments = data.length;
            });
        that.shown = true;
    } else {
        $that.text(`Show Comments (${that.numOfComments})`);
        $(".commentry").hide();
        that.shown = false;
    }
});

//hides all the comment forms unless comment is clicked.
$(".comment-form").css('display', 'none');

//automatically sets the "author" input value to the user's name
$(".author").val(user.name);

//handles the click that starts the scraping process,then reloads the page.
$("#scrape").click(function () {
    $.get("/scrape")
        .then(function () {
            $.get("/")
            window.location.reload(true)
        })
});

//click handler: 
//  -validates entries
//  -prompts user if incomplete
//  -request to post comment object to database
let attempted = false;
$(".submit").click(function () {
    event.preventDefault();
    console.log('comment clicked.')
    let id = $(this).data('id');
    let comment = $(`#comment${id}`).val();
    let author = $(`#author${id}`).val();
    console.log(comment, author);
    if (!comment || !author) {
        if (attempted == false) {
            $("<p>").prependTo("body")
                .text('You forgot to fill some things out...')
                .css('width', '100%')
                .css('height', '5%')
                .css('text-align', 'center')
                .css('font-size', '3vw')
                .css('background-color', 'white')
                .css('color', 'red')
                .css('font-family', 'londrina solid')
                .attr('id', 'forgot');
        }
        document.querySelector('#forgot').scrollIntoView({
            behavior: 'smooth',
        })
        attempted = true;
        return;
    } else {
        let commentObject = {
            comment: comment.trim(),
            author: author.trim(),
            article: id,
            authorId: user.id,
        }
        $.ajax("/api/comment/" + id, {
            type: "POST",
            data: commentObject,
        }).then(
            function (data, success) {
                getAllComments(id)
                    .then(comments => {
                        popComments(comments, id)
                    })
    //             let commentor = commentObject.author;
    //             if (commentObject.authorId == user.id) {
    //                 commentor = "You";
    //             }
    //             $(`.show-comments[data-id='${id}']`)
    //                 .append(`<p>${commentor} said: </p>
    // <p>"${commentObject.comment}"</p>`);
                console.log('The post was successful!');
                console.log("this is the then function's success:", success);
            })
    }
})



//handles the click that starts grabbing comments from the database
//and appends them to the show-comments element.
// $(".show-comments").click(function () {
//     let id = $(this).data('id');
//     let that = this;
//     let $that = $(this);
//     if (that.shown == undefined) {
//         that.shown = false;
//     }


//     if (that.shown == false) {
//         $that.text('Hide Comments');
//         if (that.fetched == false) {
//             that.commentArray = [];
//             $.get("/comment/" + id)
//                 .then(data => {
//                     data[0].comments.forEach((e, i) => {
//                         that.commentArray.push(e);
//                     })
//                 })
//                 .then(() => {
//                     popComments(that.commentArray, that, $that);
//                     that.fetched = true;
//                 })
//         } else {
//             popComments(that.commentArray, that, $that)
//         }
//     } else {
//         $that.text(`Show Comments (${that.commentArray.length})`);
//         $(".commentry").hide();
//         that.shown = false;
//     }
// });

$(".comment").click(function () {
    let id = $(this).data('id');
    $(`.comment-form[data-id='${id}']`)
        .css('display', 'flex');
    console.log(`clicked this ${id}`)
});



