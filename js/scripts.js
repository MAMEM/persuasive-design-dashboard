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


function calculateDailyCalendar(sessions, calendar, dayTS, nextDayTS) {

    // 1.1 E-mail
    if (sessions.email) { calendar[calendar.length-1].email = calculateDailyData('email', sessions.email, dayTS, nextDayTS, calendar[calendar.length-1].email, calendar[calendar.length-2] ? calendar[calendar.length-2].email : null); }

    // 1.2 General Social Network activity
    // Calculate social networks first
    if (sessions.social.facebook) { calendar[calendar.length-1].facebook = calculateDailyData('facebook', sessions.social.facebook, dayTS, nextDayTS, calendar[calendar.length-1].facebook, calendar[calendar.length-2] ? calendar[calendar.length-2].facebook: null); }
    if (sessions.social.twitter) { calendar[calendar.length-1].twitter = calculateDailyData('twitter', sessions.social.twitter, dayTS, nextDayTS, calendar[calendar.length-1].twitter, calendar[calendar.length-2] ? calendar[calendar.length-2].twitter : null); }
    if (sessions.social.instagram) { calendar[calendar.length-1].instagram = calculateDailyData('instagram', sessions.social.instagram, dayTS, nextDayTS, calendar[calendar.length-1].instagram, calendar[calendar.length-2] ? calendar[calendar.length-2].instagram : null); }

    // Now calculate data from social Tracker
    if (sessions.social.facebook) {  }
    if (sessions.social.twitter) {  }
    if (sessions.social.instagram) {  }

    if (sessions.forum) { calendar[calendar.length-1].forum = calculateDailyData('forum', sessions.forum, dayTS, nextDayTS, calendar[calendar.length-1].forum, calendar[calendar.length-2] ? calendar[calendar.length-2].forum : null); }
    if (sessions.youtube) { calendar[calendar.length-1].youtube = calculateDailyData('youtube', sessions.youtube, dayTS, nextDayTS, calendar[calendar.length-1].youtube, calendar[calendar.length-2] ? calendar[calendar.length-2].youtube : null); }
    if (sessions.news) { calendar[calendar.length-1].news = calculateDailyData('news', sessions.news, dayTS, nextDayTS, calendar[calendar.length-1].news, calendar[calendar.length-2] ? calendar[calendar.length-2].news : null); }
    if (sessions.entertainment) { calendar[calendar.length-1].entertainment = calculateDailyData('entertainment', sessions.entertainment, dayTS, nextDayTS, calendar[calendar.length-1].entertainment, calendar[calendar.length-2] ? calendar[calendar.length-2].entertainment : null); }
    if (sessions.health) { calendar[calendar.length-1].health = calculateDailyData('health', sessions.health, dayTS, nextDayTS, calendar[calendar.length-1].health, calendar[calendar.length-2] ? calendar[calendar.length-2].health : null); }
    if (sessions.elearning) { calendar[calendar.length-1].elearning = calculateDailyData('elearning', sessions.elearning, dayTS, nextDayTS, calendar[calendar.length-1].elearning, calendar[calendar.length-2] ? calendar[calendar.length-2].elearning : null); }
    if (sessions.linkedin) { calendar[calendar.length-1].linkedin = calculateDailyData('linkedin', sessions.linkedin, dayTS, nextDayTS, calendar[calendar.length-1].linkedin, calendar[calendar.length-2] ? calendar[calendar.length-2].linkedin : null); }
    if (sessions.job) { calendar[calendar.length-1].job = calculateDailyData('job', sessions.job, dayTS, nextDayTS, calendar[calendar.length-1].job, calendar[calendar.length-2] ? calendar[calendar.length-2].job : null); }

    return calendar;
}

function calculateDailyData(sessionType, sessions, dayTS, nextDayTS, calendarEntry, prevCalendarEntry) {

    var j = 0;
    var k = 0;
    var clicks = 0;
    var totalClicks = 0;
    var duration = 0;
    var score = 0;
    var average = 0;
    var prevValsArr = [];
    var stDev = 0;
    var sdNum = 2;
    var maxAvg = 0;
    var minAvg = 0;
    var sdIndicator = 0;

    if (sessions) {

        for (j=0;j < sessions.length; j++) {

            // If there is data for this day
            if (sessions[j].startTimestamp > dayTS && sessions[j].startTimestamp < nextDayTS) {

                if (sessions[j].pages) {
                    for (k in sessions[j].pages) {
                        clicks += sessions[j].pages[k].clickCount;
                    }
                }
                duration += sessions[j].durationUserActive;
                totalClicks += clicks;
            }
        }

        if (prevCalendarEntry) {

            prevValsArr = prevCalendarEntry[0].prevValsArr;

            /*average = prevCalendarEntry[0].duration + duration / 2;*/
            average = CalculateAverage (prevValsArr);

            // May not be accurate
            if (prevValsArr.length > 2) {
                stDev = standardDeviation(prevValsArr);
            } else {
                stDev = 100;
            }

            maxAvg = average + (sdNum * stDev);
            minAvg = average - (sdNum * stDev);

            sdIndicator = (( duration - average )/( sdNum * stDev ));

            score = 50 + (duration - average)/(maxAvg - average)*50;
            /*score = 50 + (sdIndicator * 50);*/

            prevValsArr.push(duration);

        } else {
            prevValsArr = [duration];
            sdIndicator = 0;
        }

        console.log(score);

        calendarEntry.push({
            duration: duration,
            clicks: clicks,
            average: average,
            prevValsArr: prevValsArr,
            score: score
        });

    }
    return calendarEntry;
}


function calculateWeeklyCalendar(calendar, sessionType) {

    var weekly = [];
    var week;

    var i = 0, j = 0;

    for (i=0; i<calendar.length; i++) {

        if (calendar[i-1]) {

            if (calendar[i].week !== calendar[i-1].week) {
                // Changed week!
                week++;
                weekly[week] = {};
                for (j in sessionType) {
                    weekly[week-1][sessionType[j]] = weekly[week-1][sessionType[j]]/7;
                    weekly[week][sessionType[j]] = 0;
                }
            }

        } else {
            week = 0;
            weekly[week] = {};
            for (j in sessionType) {
                weekly[week][sessionType[j]] = 0;
            }
        }

        for (j in sessionType) {
            weekly[week][sessionType[j]] += calendar[i][sessionType[j]][0].duration;
        }
    }
    return weekly;
}


function calculateScoreAverage(calendar, sessionType) {

    var sum = 0;

    for (var i=0;i<calendar.length;i++) {

        sum = sum + calendar[i][sessionType][0].score;
    }

    return sum / calendar.length;
}

function drawChart(calendar, detailed) {

    var i=0;

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');

    if (detailed) {

        // Add calendar cats
        for ( i=0; i < sessionType.length; i++ ) {
            data.addColumn('number', sessionType[i]);
        }

        for ( i=0; i < calendar.length; i++ ) {

            data.addRows([[
                calendar[i].day + '/' + calendar[i].month /*+ '-' + calendar[i].year*/,
                calendar[i][sessionType[0]][0].score,
                calendar[i][sessionType[1]][0].score,
                calendar[i][sessionType[2]][0].score,
                calendar[i][sessionType[3]][0].score,
                calendar[i][sessionType[4]][0].score,
                calendar[i][sessionType[5]][0].score,
                calendar[i][sessionType[6]][0].score,
                calendar[i][sessionType[7]][0].score,
                calendar[i][sessionType[8]][0].score,
                calendar[i][sessionType[9]][0].score,
                calendar[i][sessionType[10]][0].score,
                calendar[i][sessionType[11]][0].score
            ]]);
        }

    } else {

        data.addColumn('number', 'Participation & Social');
        data.addColumn('number', 'Empowerment & Wellbeing');
        data.addColumn('number', 'Education & Employment');

        for ( i=0; i < calendar.length; i++ ) {

            data.addRows([[
                calendar[i].day + '/' + calendar[i].month /*+ '-' + calendar[i].year*/,

                (calendar[i][sessionType[0]][0].score + calendar[i][sessionType[1]][0].score + calendar[i][sessionType[2]][0].score +
                    calendar[i][sessionType[3]][0].score + calendar[i][sessionType[4]][0].score + calendar[i][sessionType[5]][0].score + calendar[i][sessionType[6]][0].score)/7,

                (calendar[i][sessionType[5]][0].score + calendar[i][sessionType[6]][0].score + calendar[i][sessionType[7]][0].score + calendar[i][sessionType[8]][0].score)/4,

                (calendar[i][sessionType[9]][0].score + calendar[i][sessionType[10]][0].score + calendar[i][sessionType[11]][0].score)/3
            ]]);
        }
    }

    var options = {
        title: 'Score',
        legend: { position: 'right' },
        series: {
            0: { color: '#F44336' },
            1: { color: '#FFEB3B' },
            2: { color: '#03A9F4' }
        },
        height: 500,
        hAxis: {
            textStyle: {
                fontSize: 9
            }
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart'));

    chart.draw(data, options);
}

function calculateTrainingIndicators(levels) {

    if (levels.basic) {
        if (levels.basic.level1) {
            if (levels.basic.level1.trophyGained) {
                $('#basic1Indicator').addClass( 'bg-yellow' );
            }
            else {
                $('#basic1Indicator').addClass( 'bg-blue' );
            }
        }

        if (levels.basic.level2) {
            if (levels.basic.level2.trophyGained) {
                $('#basic2Indicator').addClass( 'bg-yellow' );
            }
            else {
                $('#basic2Indicator').addClass( 'bg-blue' );
            }
        }
    }

    if (levels.int) {
        if (levels.int.level1) {
            if (levels.int.level1.trophyGained) {
                $('#int1Indicator').addClass( 'bg-yellow' );
            }
            else {
                $('#int1Indicator').addClass( 'bg-blue' );
            }
        }
        if (levels.int.level2) {
            if (levels.int.level2.trophyGained) {
                $('#int2Indicator').addClass( 'bg-yellow' );
            }
            else {
                $('#int2Indicator').addClass( 'bg-blue' );
            }
        }
        if (levels.int.level3) {
            if (levels.int.level3.trophyGained) {
                $('#int3Indicator').addClass( 'bg-yellow' );
            }
            else {
                $('#int3Indicator').addClass( 'bg-blue' );
            }
        }
    }

    if (levels.adv) {
        if (levels.adv.level1) {
            if (levels.adv.level1.trophyGained) {
                $('#adv1Indicator').addClass( 'bg-yellow' );
            }
            else {
                $('#adv1Indicator').addClass( 'bg-blue' );
            }
        }
        if (levels.adv.level2) {
            if (levels.adv.level2.trophyGained) {
                $('#adv2Indicator').addClass( 'bg-yellow' );
            }
            else {
                $('#adv2Indicator').addClass( 'bg-blue' );
            }
        }
        if (levels.adv.level3) {
            if (levels.adv.level3.trophyGained) {
                $('#adv3Indicator').addClass( 'bg-yellow' );
            }
            else {
                $('#adv3Indicator').addClass( 'bg-blue' );
            }
        }
        if (levels.adv.level4) {
            if (levels.adv.level4.trophyGained) {
                $('#adv4Indicator').addClass( 'bg-yellow' );
            }
            else {
                $('#adv4Indicator').addClass( 'bg-blue' );
            }
        }
    }
}


function standardDeviation(values){
    var avg = CalculateAverage(values);

    var squareDiffs = values.map(function(value){
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var avgSquareDiff = CalculateAverage(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

function CalculateAverage(data){
    var sum = data.reduce(function(sum, value){
        return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
}