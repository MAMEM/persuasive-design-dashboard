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
            average = calculateAverage(prevValsArr);

            if (average === 0) {
                if (duration > 0) {
                    score = 75;
                } else {
                    score = 25;
                }
            } else {

                if (prevValsArr.length > 2) {
                    stDev = standardDeviation(prevValsArr);
                } else {
                    stDev = 100;
                }

                // All our data have the same value
                if (stDev === 0) {
                    stDev = 0.3 * average;
                }

                /*maxAvg = average + (sdNum * stDev);
                minAvg = average - (sdNum * stDev);
                score = 50 + (duration - average)/(maxAvg - average)*50;*/

                sdIndicator = ( duration - average )/( sdNum * stDev );
                score = 50 + (sdIndicator * 50);
            }

            prevValsArr.push(duration);

        } else {
            prevValsArr = [duration];
        }

        if (score > 100) {
            score = 100;
        }

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
                    weekly[week-1][sessionType[j]] = parseInt((weekly[week-1][sessionType[j]]/7), 10);
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

            if (calendar[i][sessionType[j]][0]) {

                calendar[i][sessionType[j]][0].score = calendar[i][sessionType[j]][0] ? calendar[i][sessionType[j]][0].score : 0 ;

                weekly[week][sessionType[j]] += calendar[i][sessionType[j]][0].score;
            }
        }
    }
    return weekly;
}


function calculateScoreAverage(calendar, sessionType) {

    var sum = 0;
    var avg = 0;
    var counter = 0;

    for (var i=0;i<calendar.length;i++) {

        if (calendar[i][sessionType].length !== 0) {
            sum = sum + calendar[i][sessionType][0].score;
            counter++;
        }
    }

    avg = sum ? sum / counter : 0 ;
    return parseInt(avg, 10);
}

function drawChart(calendar, detailed) {

    var i=0, j=0;

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');


    for ( i=0; i < calendar.length; i++ ) {
        for ( j=0; j < 12; j++ ) {

            if (!calendar[i][sessionType[j]][0]) {
                calendar[i][sessionType[j]][0] = [];
                calendar[i][sessionType[j]][0].score = 0;
            }

        }
    }

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

        data.addColumn('number', text.participation);
        data.addColumn('number', text.empowerment);
        data.addColumn('number', text.education);

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
        title: text.score,
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

    var sum = 0;

    if (levels.basic) {
        if (levels.basic.level1) {
            if (levels.basic.level1.trophyGained) {
                $('#basic1Indicator').addClass( 'bg-yellow' );
                sum+=2;
            }
            else {
                $('#basic1Indicator').addClass( 'bg-blue' );
                sum+=1;
            }
        }

        if (levels.basic.level2) {
            if (levels.basic.level2.trophyGained) {
                $('#basic2Indicator').addClass( 'bg-yellow' );
                sum+=2;
            }
            else {
                $('#basic2Indicator').addClass( 'bg-blue' );
                sum+=1;
            }
        }
    }

    if (levels.int) {
        if (levels.int.level1) {
            if (levels.int.level1.trophyGained) {
                $('#int1Indicator').addClass( 'bg-yellow' );
                sum+=2;
            }
            else {
                $('#int1Indicator').addClass( 'bg-blue' );
                sum+=1;
            }
        }
        if (levels.int.level2) {
            if (levels.int.level2.trophyGained) {
                $('#int2Indicator').addClass( 'bg-yellow' );
                sum+=2;
            }
            else {
                $('#int2Indicator').addClass( 'bg-blue' );
                sum+=1;
            }
        }
        if (levels.int.level3) {
            if (levels.int.level3.trophyGained) {
                $('#int3Indicator').addClass( 'bg-yellow' );
                sum+=2;
            }
            else {
                $('#int3Indicator').addClass( 'bg-blue' );
                sum+=1;
            }
        }
    }

    if (levels.adv) {
        if (levels.adv.level1) {
            if (levels.adv.level1.trophyGained) {
                $('#adv1Indicator').addClass( 'bg-yellow' );
                sum+=2;
            }
            else {
                $('#adv1Indicator').addClass( 'bg-blue' );
                sum+=1;
            }
        }
        if (levels.adv.level2) {
            if (levels.adv.level2.trophyGained) {
                $('#adv2Indicator').addClass( 'bg-yellow' );
                sum+=2;
            }
            else {
                $('#adv2Indicator').addClass( 'bg-blue' );
                sum+=1;
            }
        }
        if (levels.adv.level3) {
            if (levels.adv.level3.trophyGained) {
                $('#adv3Indicator').addClass( 'bg-yellow' );
                sum+=2;
            }
            else {
                $('#adv3Indicator').addClass( 'bg-blue' );
                sum+=1;
            }
        }
        if (levels.adv.level4) {
            if (levels.adv.level4.trophyGained) {
                $('#adv4Indicator').addClass( 'bg-yellow' );
                sum+=2;
            }
            else {
                $('#adv4Indicator').addClass( 'bg-blue' );
                sum+=1;
            }
        }
    }
    return parseInt((sum/18)*100, 10);
}

function initiateModalInformation(id) {

    $( "#modal-website-list" ).html( '' );

    switch(id) {
        case "detailsEmailBtn":

            $( "#modal-header-task-name" ).html( text.email );

            $( "#modal-website-list" ).append( '<a href="http://www.gmail.com" target="_blank">Gmail</a>' );

            if (user.details.language === 'hebrew') {
                $( "#modal-website-list" ).append(
                    '<a href="http://www.mail.ru" target="_blank">Mail.ru</a>'+
                    '<a href="http://www.hotmail.com" target="_blank">Hotmail</a>'+
                    '<a href="http://www.mail.walla.co.il" target="_blank">Walla</a>'+
                    '<a href="http://www.live.com" target="_blank">Live.com</a>'
                );

            } else {
                $( "#modal-website-list" ).append(
                    '<a href="http://www.windowslive.com" target="_blank">Windows Live</a>'+
                    '<a href="http://www.yahoo.com" target="_blank">Yahoo</a>'+
                    '<a href="http://www.hotmail.com" target="_blank">Hotmail</a>' +
                    '<a href="http://www.cosmote.gr" target="_blank">Cosmote</a>' );
            }

            break;
        case "detailsSocialBtn":

            $( "#modal-header-task-name" ).html( text.social_media_networks );

            if (user.details.language === 'hebrew') {
                $( "#modal-website-list" ).append(
                    '<a href="http://www.facebook.co.il" target="_blank">Facebook</a>' +
                    '<a href="http://www.twitter.co.il" target="_blank">Twitter</a>' +
                    '<a href="http://www.ok.ru" target="_blank">OK.ru</a>' +
                    '<a href="http://www.whatsapp.com" target="_blank">Whatsapp</a>'
                );
            } else {
                $( "#modal-website-list" ).append(
                    '<a href="http://www.facebook.com" target="_blank">Facebook</a>' +
                    '<a href="http://www.twitter.com" target="_blank">Twitter</a>'
                );
            }

            $( "#modal-website-list" ).append(
                '<a href="http://www.instagram.com" target="_blank">Instagram</a>' +
                '<a href="http://www.plus.google.com" target="_blank">Google+</a>'
            );

            break;
        case "detailsForaBtn":

            $( "#modal-header-task-name" ).html( text.fora );

            if (user.details.language === 'hebrew') {
                $( "#modal-website-list" ).append(
                    '<a href="http://www.zap.co.il" target="_blank">Zap</a>'+
                    '<a href="http://www.carsforum.co.il" target="_blank">Cars Forum</a>'+
                    '<a href="http://www.atraf.co.il" target="_blank">Atraf</a>'+
                    '<a href="http://www.yad2.co.il" target="_blank">Yad2</a>'
                );
            } else {
                $( "#modal-website-list" ).append( '' +
                    '<a href="http://www.mdahellas.gr" target="_blank">MDA Hellas</a>'+
                    '<a href="http://www.artimeleia.gr" target="_blank">Αρτιμέλεια</a>'
                );
            }

            break;
        case "detailsYtBtn":
        case "detailsYtBtn2":

            $( "#modal-header-task-name" ).html( text.youtube );

            $( "#modal-website-list" ).append( '<a href="http://www.youtube.com" target="_blank">YouTube</a>' );

            break;
        case "detailsNewsBtn":
        case "detailsNewsBtn2":

            $( "#modal-header-task-name" ).html( text.news );

            if (user.details.language === 'hebrew') {
                $( "#modal-website-list" ).append(
                    '<a href="http://www.ynet.co.il" target="_blank">Ynet</a>' +
                    '<a href="http://www.walla.co.il" target="_blank">Walla</a>' +
                    '<a href="http://www.mako.co.il" target="_blank">Mako</a>' +
                    '<a href="http://www.yahoo.com" target="_blank">Yahoo</a>' +
                    '<a href="http://www.sport5.co.il" target="_blank">Sport5</a>' +
                    '<a href="http://www.one.co.il" target="_blank">One</a>' +
                    '<a href="http://www.themarker.com" target="_blank">The Marker</a>'
                );
            } else {

                $( "#modal-website-list" ).append(
                    '<a href="http://www.in.gr" target="_blank">in.gr</a>'+
                    '<a href="http://www.taxheaven.gr" target="_blank">Tax Heaven</a>'+
                    '<a href="http://www.ekathimerini.com" target="_blank">Καθημερινή</a>'+
                    '<a href="http://www.tovima.gr" target="_blank">Το Βήμα</a>'+
                    '<a href="http://www.iefimerida.gr" target="_blank">Iefimerida</a>'+
                    '<a href="http://www.theguardian.com" target="_blank">The Guardian</a>'+
                    '<a href="http://www.nba.com" target="_blank">NBA</a>'+
                    '<a href="http://www.gazzetta.gr" target="_blank">Gazzetta</a>'+
                    '<a href="http://www.protothema.gr" target="_blank">Πρώτο Θέμα</a>'+
                    '<a href="http://www.newsit.gr" target="_blank">News it</a>'+
                    '<a href="http://www.sport24.gr" target="_blank">Sport24</a>'+
                    '<a href="http://www.news247.gr" target="_blank">News247</a>'+
                    '<a href="http://www.newsbomb.gr" target="_blank">Newsbomb</a>'+
                    '<a href="http://www.newsbeast.gr" target="_blank">Newsbeast</a>'+
                    '<a href="http://www.zougla.gr" target="_blank">Ζούγκλα</a>'+
                    '<a href="http://www.contra.gr" target="_blank">Contra</a>'+
                    '<a href="http://www.lifo.gr" target="_blank">LIFO</a>'+
                    '<a href="http://www.pronews.gr" target="_blank">Pro News</a>'+
                    '<a href="http://www.diaforetiko.gr" target="_blank">Διαφορετικό</a>'+
                    '<a href="http://www.novasports.gr" target="_blank">Nova Sports</a>'
                );
            }

            break;
        case "detailsEntBtn":

            $( "#modal-header-task-name" ).html( text.entertainment );

            $( "#modal-website-list" ).append('<a href="http://www.ynet.co.il" target="_blank">Netflix</a>');

            if (user.details.language === 'hebrew') {
                $( "#modal-website-list" ).append(
                    '<a href="http://www.dailybuzz.co.il" target="_blank">Daily Buzz</a>' +
                    '<a href="http://www.sdarot.click" target="_blank">Sdarot</a>' +
                    '<a href="http://www.tvil.me" target="_blank">Tvil</a>' +
                    '<a href="http://www.mako.co.il" target="_blank">Mako</a>'
                );
            } else {
                $( "#modal-website-list" ).append('<a href="http://www.gamato.gr" target="_blank">gamato.gr</a>');

            }
            break;
        case "detailsHealthBtn":

            $( "#modal-header-task-name" ).html( text.health );

            if (user.details.language === 'hebrew') {

                $( "#modal-website-list" ).append(
                    '<a href="http://www.tlvmed.co.il" target="_blank">TLVMed</a>' +
                    '<a href="http://www.maccabi4u.co.il" target="_blank">Maccabi4U</a>' +
                    '<a href="http://www.clalit.org.il" target="_blank">Clalit</a>' +
                    '<a href="http://www.iherb.com" target="_blank">IHerb</a>' +
                    '<a href="http://www.healthy.walla.co.il" target="_blank">Healthy - Walla</a>'
                );

            } else if (user.details.group === 'parkinson') {
                $( "#modal-website-list" ).append('<a href="http://www.parkinsonofficial.gr" target="_blank">Parkinson Official</a>');

            }

            break;
        case "detailsElearningBtn":

            $( "#modal-header-task-name" ).html( text.elearning );

            $( "#modal-website-list" ).append('<a href="http://www.coursera.com" target="_blank">Coursera</a>');

            if (user.details.language === 'hebrew') {
                $( "#modal-website-list" ).append(
                    '<a href="http://www.cet.ac.il" target="_blank">CET</a>' +
                    '<a href="http://www.education.gov.il" target="_blank">Education.gov.il</a>' +
                    '<a href="http://www.openu.ac.il" target="_blank">OpenU</a>' +
                    '<a href="http://www.huji.ac.il" target="_blank">Huji</a>' +
                    '<a href="http://www.tau.ac.il" target="_blank">Tau</a>'
                );
            } else {
                $( "#modal-website-list" ).append(
                    '<a href="http://www.elearn.elke.uoa.gr" target="_blank">E-learn - UOA</a>'
                );
            }

            break;
        case "detailsProBtn":

            $( "#modal-header-task-name" ).html( 'LinkedIn' );

            $( "#modal-website-list" ).append('<a href="http://www.linkedin.com" target="_blank">LinkedIn</a>');

            break;
        case "detailsJobBtn":

            $( "#modal-header-task-name" ).html( text.jobs );

            if (user.details.language === 'hebrew') {
                $( "#modal-website-list" ).append(
                    '<a href="http://www.alljobs.co.il" target="_blank">AllJobs</a>' +
                    '<a href="http://www.drushim.co.il" target="_blank">Drushim</a>' +
                    '<a href="http://www.jobmaster.co.il" target="_blank">Jobmaster</a>' +
                    '<a href="http://www.jobnet.co.il" target="_blank">Jobnet</a>'
                );
            }
            break;
    }
}

function standardDeviation(values){
    var avg = calculateAverage(values);

    var squareDiffs = values.map(function(value){
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var avgSquareDiff = calculateAverage(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

function calculateAverage(data){
    var sum = data.reduce(function(sum, value){
        return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
}