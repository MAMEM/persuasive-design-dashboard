"use strict";

function createFBItems(arr) {

    var posts = [];

    for (var i=0; i < arr.length; i++) {

        // Remove new line chars from title
        var post_title = !!arr[i].message ? arr[i].message.replace(/\n/g, " ") : "Shared post: "+ arr[i].link;

        var shared_post = arr[i].status_type === "shared_story";
        var has_image = arr[i].type === "photo";
        var has_video = arr[i].type === "video";

        var media_post = (has_image | has_video);

        var pub_time = String(Date.parse(arr[i].created_time));
        pub_time = parseInt(pub_time.slice(0, -3), 10);

        posts.push({
            title: post_title,
            id: arr[i].id,
            pageUrl: arr[i].permalink_url,
            publicationTime: pub_time,
            original: !shared_post,
            likes: arr[i].likes ? arr[i].likes : 0,
            shares: arr[i].shares ? arr[i].shares : 0,
            comments: arr[i].comments ? arr[i].comments : 0
        });

        posts[posts.length-1].type = media_post ? 'mediaItem' : 'item' ;

        if (media_post) {
            posts[posts.length-1].mediaType = has_image ? 'image' : 'video';
            posts[posts.length-1].mediaUrl = has_image ?  arr[i].picture :  arr[i].source;
            posts[posts.length-1].thumbnail = arr[i].picture;
        }
    }

    return posts;
}

function createTwitterItems(arr) {

    var items = [], retweet;

    for (var i=0; i < arr.length; i++) {

        // Remove new line chars from title
        retweet = !arr[i].original;

        var pub_time = String(arr[i].publicationTime);
        pub_time = parseInt(pub_time.slice(0, -3), 10);

        items.push({
            title: arr[i].cleanTitle,
            id: arr[i].id,
            pageUrl: arr[i].pageUrl,
            publicationTime: pub_time,
            original: !retweet,
            rt: retweet,
            mentions: arr[i].mentions,
            tags: arr[i].tags,
            likes: arr[i].likes ? arr[i].likes : 0,
            shares: arr[i].shares ? arr[i].shares : 0,
            comments: arr[i].comments ? arr[i].comments : 0,
            type: arr[i].type
        });

        if (items[items.length-1].type === 'mediaItem') {
            items[items.length-1].mediaType = arr[i].mediaType;
            items[items.length-1].mediaUrl = arr[i].mediaUrl;
            items[items.length-1].thumbnail = arr[i].thumbnail;
        }

        if (retweet) {
            items[items.length-1].reference = arr[i].reference;
            items[items.length-1].referencedUserId = arr[i].referencedUserId;
        }
    }

    return items;
}

function createGooglePlusItems(arr) {

    var items = [], original;

    for (var i=0; i < arr.length; i++) {

        original = arr[i].original;

        var pub_time = String(arr[i].publicationTime);
        pub_time = parseInt(pub_time.slice(0, -3), 10);

        items.push({
            title: arr[i].cleanTitle,
            id: arr[i].id,
            pageUrl: arr[i].pageUrl,
            publicationTime: pub_time,
            original: original,
            tags: arr[i].tags,
            likes: arr[i].likes ? arr[i].likes : 0,
            shares: arr[i].shares ? arr[i].shares : 0,
            comments: arr[i].comments ? arr[i].comments : 0,
            type: arr[i].type
        });

        if (items[items.length-1].type === 'mediaItem') {
            items[items.length-1].mediaType = arr[i].mediaType;
            items[items.length-1].mediaUrl = arr[i].mediaUrl;
            items[items.length-1].thumbnail = arr[i].thumbnail;
        }

        if (!original) {
            items[items.length-1].reference = arr[i].reference;
            items[items.length-1].referencedUserId = arr[i].referencedUserId;
        }
    }
    return items;
}

function initFirebaseData(sessions, snapshot) {

    // Initialize Firebase Data
    sessions.email = snapshot.val().pageActivity.email ? snapshot.val().pageActivity.email.sessions : false;

    sessions.social = [];
    sessions.social.facebook = snapshot.val().pageActivity.facebook ? snapshot.val().pageActivity.facebook.sessions : false;
    sessions.social.twitter = snapshot.val().pageActivity.twitter ? snapshot.val().pageActivity.twitter.sessions : false;
    sessions.social.instagram = snapshot.val().pageActivity.instagram ? snapshot.val().pageActivity.instagram.sessions : false;

    sessions.forum = snapshot.val().pageActivity.forum ? snapshot.val().pageActivity.forum.sessions : false;

    sessions.youtube = snapshot.val().pageActivity.youtube ? snapshot.val().pageActivity.youtube.sessions : false;

    sessions.news = snapshot.val().pageActivity.news ? snapshot.val().pageActivity.news.sessions : false;

    sessions.entertainment = snapshot.val().pageActivity.entertainment ? snapshot.val().pageActivity.entertainment.sessions : false;

    sessions.health = snapshot.val().pageActivity.health ? snapshot.val().pageActivity.health.sessions : false;

    sessions.elearning = snapshot.val().pageActivity.elearning ? snapshot.val().pageActivity.elearning.sessions : false;

    sessions.linkedin = snapshot.val().pageActivity.linkedin ? snapshot.val().pageActivity.linkedin.sessions : false;

    sessions.job = snapshot.val().pageActivity.job ? snapshot.val().pageActivity.job.sessions : false;

    sessions.socialTracker = snapshot.val().socialTracker ? snapshot.val().socialTracker : false;

    return sessions;
}


function calculateScores(sessionType, sessions, dayTS, nextDayTS, calendarEntry) {

    var j = 0;
    var k = 0;
    var clicks = 0;

    if (sessions) {
        for (j=0;j < sessions.length; j++) {

            if (sessions[j].startTimestamp > dayTS && sessions[j].startTimestamp < nextDayTS) {
                console.log("seconds of use", sessions[j].durationUserActive);

                if (sessions[j].pages) {
                    for (k in sessions[j].pages) {
                        clicks += sessions[j].pages[k].clickCount;
                    }
                }

                console.log(calendarEntry);

                calendarEntry.push({
                    duration: sessions[j].durationUserActive,
                    clicks: clicks
                });
            }
        }
    }
    return calendarEntry;
}