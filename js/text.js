var text = {};

var textEnglish = {
    help: 'HELP',
    help_desc: 'Contact us if you need help',
    profile: 'PROFILE',
    profile_desc: 'Edit your information',
    training: 'TRAINING',
    training_desc: 'Replay the training software to score better',
    basic: 'Basic',
    int: 'Int',
    adv: 'Adv',
    training_summary: 'Training summary',
    score_summary: 'Score summary',
    total_score: 'Total score',
    details: 'DETAILS',
    details_desc: 'See how you can improve',
    graphs: 'GRAPHS',
    graphs_desc: 'See how well you perform over time',
    get_better: 'How to get better',
    participation: 'Participation & Social',
    empowerment: 'Empowerment & Wellbeing',
    education: 'Education & Employment',
    email: 'E-mail',
    social_media: 'Social media',
    social_media_networks: 'Social Media Networks',
    fora: 'Fora',
    youtube: 'YouTube',
    news: 'News',
    entertainment: 'Entertainment',
    health: 'Health',
    elearning: 'E-learning',
    pro: 'Pro networks',
    job: 'Job search',
    cats_basic: 'Basic categories',
    cats_all: 'All categories',
    score: 'Score',
    modal_header_1: 'To improve your score on',
    modal_header_2: 'spend more time on the following websites'
};

var textGreek = {
    help: 'ΒΟΗΘΕΙΑ',
    help_desc: 'Επικοινωνήστε μαζί μας',
    profile: 'ΠΡΟΦΙΛ',
    profile_desc: 'Επεξεργασία προσωπικών στοιχείων',
    training: 'ΕΚΠΑΙΔΕΥΣΗ',
    training_desc: 'Δοκιμάστε να πετύχετε καλύτερη βαθμολογία',
    basic: 'Βασικό',
    int: 'Ενδ.',
    adv: 'Προχ.',
    training_summary: 'Σύνοψη εκπαίδευσης',
    score_summary: 'Σύνοψη βαθμολογίας',
    total_score: 'Συνολική βαθμολογία',
    details: 'ΛΕΠΤΟΜΕΡΕΙΕΣ',
    details_desc: 'Δείτε πως μπορείτε να βελτιωθείτε',
    graphs: 'ΓΡΑΦΗΜΑΤΑ',
    graphs_desc: 'Δείτε τη βελτίωση σας με την πάροδο του χρόνου',
    get_better: 'Πως να βελτιωθείτε',
    participation: 'Συμμετοχή & Κοινωνικότητα',
    empowerment: 'Ενδυνάμωση & Ευεξία',
    education: 'Εκπαίδευση & Εργασία',
    email: 'E-mail',
    social_media: 'Κοινωνικά Δίκτυα',
    social_media_networks: 'Κοινωνικά Δίκτυα',
    fora: 'Fora',
    youtube: 'YouTube',
    news: 'Νέα',
    entertainment: 'Διασκέδαση',
    health: 'Υγεία',
    elearning: 'ε-μάθηση',
    pro: 'Επαγγελματικά',
    job: 'Εργασίας',
    cats_basic: 'Βασικές κατηγορίες',
    cats_all: 'Όλες οι κατηγορίες',
    score: 'Βαθμολογία',
    modal_header_1: 'Για να βελτιώσετε τη βαθμολογία σας στο',
    modal_header_2: 'ασχοληθείτε περισσότερο με τους ακόλουθους ιστότοπους'
};

var textHebrew = {
    help: 'עזרה',
    help_desc: 'פנו אלינו אם אתם זקוקים לעזרה',
    profile: 'פרופיל',
    profile_desc: 'ערכו את המידע שלכם',
    training: 'אימון',
    training_desc: 'הפעל מחדש את תוכנת האימון כדי לקבל ציון טוב יותר',
    basic: 'בסיסי',
    int: 'ביניים',
    adv: 'מתקדם',
    training_summary: 'סיכום האימון',
    score_summary: 'סיכום הציון',
    total_score: 'ציון כללי',
    details: 'פרטים',
    details_desc: 'ראו כיצד תוכלו לשפר את הציון',
    graphs: 'גרפים',
    graphs_desc: 'ראו כמה טוב אתם מבצעים לאורך זמן',
    get_better: 'כיצד להשתפר',
    participation: 'השתתפות חברתית',
    empowerment: 'העצמה ורווחה',
    education: 'חינוך ותעסוקה',
    email: 'דואר אלקטרוני',
    social_media: 'מדיה חברתית',
    social_media_networks: 'רשתות חברתיות',
    fora: 'פורומים',
    youtube: 'YouTube',
    news: 'חדשות',
    entertainment: 'בידור',
    health: 'בריאות',
    elearning: 'E-learning',
    pro: 'רשתות מקצעויות,',
    job: 'חיפוש עבודה',
    cats_basic: 'קטגוריות בסיסיות',
    cats_all: 'כל הקטגוריות',
    score: 'ציון',
    modal_header_1: 'כדי לשפר את הציון שלכם ב',
    modal_header_2: 'יש להשקיע יותר זמן באתרים הבאים'

};

function translate(lang) {
    switch(lang) {
        case 'english':
            text = textEnglish;
            renderText(text);
            break;
        case 'greek':
            text = textGreek;
            renderText(text);
            break;
        case 'hebrew':
            text = textHebrew;
            renderText(text);
            break;
    }
}

function renderText(text) {

    $('#helpBtnText').text(text.help);
    $('#helpBtnTextDesc').text(text.help_desc);
    $('#profileBtnText').text(text.profile);
    $('#profileBtnTextDesc').text(text.profile_desc);
    $('#trainingBtnText').text(text.training);
    $('#trainingBtnTextDesc').text(text.training_desc);
    $('#basicText').text(text.basic);
    $('#intText').text(text.int);
    $('#advText').text(text.adv);
    $('#trainingSummaryText').text(text.training_summary);
    $('#scoreSummaryText').text(text.score_summary);
    $('#totalScoreText').text(text.total_score);
    $('#detailsText').text(text.details);
    $('#detailsTextDesc').text(text.details_desc);
    $('#graphsText').text(text.graphs);
    $('#graphsTextDesc').text(text.graphs_desc);
    $('#getBetterText').text(text.get_better);
    $('#participationText').text(text.participation);
    $('#empowermentText').text(text.empowerment);
    $('#educationText').text(text.education);
    $('#emailText').text(text.email);
    $('#socialText').text(text.social_media);
    $('#foraText').text(text.fora);
    $('#youtubeText').text(text.youtube);
    $('#youtubeText2').text(text.youtube);
    $('#newsText').text(text.news);
    $('#newsText2').text(text.news);
    $('#entertainmentText').text(text.entertainment);
    $('#healthText').text(text.health);
    $('#elearningText').text(text.elearning);
    $('#proText').text(text.pro);
    $('#jobText').text(text.job);
    $('#basicCatsBtn').text(text.cats_basic);
    $('#allCatsBtn').text(text.cats_all);
    $('#modalHeaderText1').text(text.modal_header_1);
    $('#modalHeaderText2').text(text.modal_header_2);

}
