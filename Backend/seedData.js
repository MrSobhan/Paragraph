const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User, Post, Comment, Topic, Notification } = require('./models');
require('dotenv').config();

const sampleUsers = [
  { username: 'ali_ahmadi', email: 'ali.ahmadi@example.com', name: 'علی احمدی', phone: '09123456789' },
  { username: 'sara_rezaei', email: 'sara.rezaei@example.com', name: 'سارا رضایی', phone: '09123456790' },
  { username: 'hassan_moradi', email: 'hassan.moradi@example.com', name: 'حسن مرادی', phone: '09123456791' },
  { username: 'maryam_karimi', email: 'maryam.karimi@example.com', name: 'مریم کریمی', phone: '09123456792' },
  { username: 'reza_hosseini', email: 'reza.hosseini@example.com', name: 'رضا حسینی', phone: '09123456793' },
  { username: 'zahra_safari', email: 'zahra.safari@example.com', name: 'زهرا صفری', phone: '09123456794' },
  { username: 'mehdi_ghorbani', email: 'mehdi.ghorbani@example.com', name: 'مهدی قربانی', phone: '09123456795' },
  { username: 'fateme_jafari', email: 'fateme.jafari@example.com', name: 'فاطمه جعفری', phone: '09123456796' },
  { username: 'amir_rahmani', email: 'amir.rahmani@example.com', name: 'امیر رحمانی', phone: '09123456797' },
  { username: 'nasrin_bagheri', email: 'nasrin.bagheri@example.com', name: 'نسرین باقری', phone: '09123456798' },
  { username: 'javad_mohammadi', email: 'javad.mohammadi@example.com', name: 'جواد محمدی', phone: '09123456799' },
  { username: 'leila_asadi', email: 'leila.asadi@example.com', name: 'لیلا اسدی', phone: '09123456800' },
  { username: 'omid_zare', email: 'omid.zare@example.com', name: 'امید زارع', phone: '09123456801' },
  { username: 'shima_nazari', email: 'shima.nazari@example.com', name: 'شیما نظری', phone: '09123456802' },
  { username: 'babak_rostami', email: 'babak.rostami@example.com', name: 'بابک رستمی', phone: '09123456803' },
  { username: 'golnar_amini', email: 'golnar.amini@example.com', name: 'گلنار امینی', phone: '09123456804' },
  { username: 'siavash_kazemi', email: 'siavash.kazemi@example.com', name: 'سیاوش کاظمی', phone: '09123456805' },
  { username: 'mahsa_ebrahimi', email: 'mahsa.ebrahimi@example.com', name: 'مهسا ابراهیمی', phone: '09123456806' },
  { username: 'arash_salehi', email: 'arash.salehi@example.com', name: 'آرش صالحی', phone: '09123456807' },
  { username: 'niloofar_hashemi', email: 'niloofar.hashemi@example.com', name: 'نیلوفر هاشمی', phone: '09123456808' }
];

const sampleTopics = [
  { name: 'فناوری', description: 'آخرین اخبار و مقالات فناوری' },
  { name: 'برنامه‌نویسی', description: 'آموزش و تکنیک‌های برنامه‌نویسی' },
  { name: 'هوش مصنوعی', description: 'مباحث مربوط به هوش مصنوعی و یادگیری ماشین' },
  { name: 'طراحی وب', description: 'طراحی و توسعه وب‌سایت' },
  { name: 'موبایل', description: 'توسعه اپلیکیشن‌های موبایل' },
  { name: 'علم داده', description: 'تحلیل داده و علم داده' },
  { name: 'امنیت سایبری', description: 'امنیت اطلاعات و سایبری' },
  { name: 'بلاک چین', description: 'فناوری بلاک چین و ارزهای دیجیتال' },
  { name: 'کسب و کار', description: 'مدیریت و کارآفرینی' },
  { name: 'بازاریابی', description: 'استراتژی‌های بازاریابی دیجیتال' },
  { name: 'سلامت', description: 'مقالات مربوط به سلامت و پزشکی' },
  { name: 'ورزش', description: 'اخبار و مقالات ورزشی' },
  { name: 'سفر', description: 'راهنمای سفر و گردشگری' },
  { name: 'آشپزی', description: 'دستور پخت و نکات آشپزی' },
  { name: 'هنر', description: 'هنرهای تجسمی و نمایشی' },
  { name: 'موسیقی', description: 'موسیقی و آلات موسیقی' },
  { name: 'ادبیات', description: 'شعر و ادبیات فارسی' },
  { name: 'تاریخ', description: 'تاریخ ایران و جهان' },
  { name: 'فلسفه', description: 'مباحث فلسفی و اندیشه' },
  { name: 'روانشناسی', description: 'روانشناسی و رفتار انسان' },
  { name: 'اقتصاد', description: 'اقتصاد و بازارهای مالی' },
  { name: 'سیاست', description: 'تحلیل‌های سیاسی و اجتماعی' },
  { name: 'محیط زیست', description: 'حفاظت از محیط زیست' },
  { name: 'انرژی', description: 'انرژی‌های تجدیدپذیر و پایدار' },
  { name: 'خودرو', description: 'صنعت خودرو و حمل و نقل' },
  { name: 'مد و پوشاک', description: 'مد و استایل' },
  { name: 'زیبایی', description: 'مراقبت از پوست و زیبایی' },
  { name: 'خانواده', description: 'تربیت فرزند و روابط خانوادگی' },
  { name: 'آموزش', description: 'روش‌های آموزش و یادگیری' },
  { name: 'کتاب', description: 'معرفی و نقد کتاب' }
];

const samplePosts = [
  { title: 'آینده هوش مصنوعی در ایران', content: 'هوش مصنوعی یکی از مهم‌ترین فناوری‌های قرن بیست و یکم محسوب می‌شود که تأثیر عمیقی بر تمام جنبه‌های زندگی انسان خواهد داشت. در ایران نیز این فناوری به سرعت در حال رشد و توسعه است و شرکت‌های مختلفی در حال کار بر روی پروژه‌های مختلف هوش مصنوعی هستند. از تشخیص تصاویر پزشکی گرفته تا سیستم‌های پیشنهاد محتوا، هوش مصنوعی در حال تغییر شیوه کار ما است.', summary: 'بررسی وضعیت و آینده هوش مصنوعی در ایران' },
  { title: 'راهنمای کامل React برای مبتدیان', content: 'React یکی از محبوب‌ترین کتابخانه‌های JavaScript برای ساخت رابط کاربری است. این کتابخانه توسط فیس‌بوک توسعه یافته و امروزه توسط هزاران شرکت در سراسر جهان استفاده می‌شود. در این مقاله قصد داریم به صورت کامل و جامع React را آموزش دهیم. از مفاهیم پایه مثل Component و Props گرفته تا مباحث پیشرفته مثل Context API و Hooks.', summary: 'آموزش کامل React از صفر تا صد' },
  { title: 'بهترین روش‌های امنیت سایبری', content: 'امنیت سایبری در عصر دیجیتال اهمیت بیشتری پیدا کرده است. با افزایش حملات سایبری و سرقت اطلاعات، شرکت‌ها و افراد باید بیش از پیش مراقب امنیت اطلاعات خود باشند. در این مقاله به بررسی بهترین روش‌های حفاظت از اطلاعات، استفاده از رمزهای قوی، احراز هویت دو مرحله‌ای و سایر تکنیک‌های امنیتی می‌پردازیم.', summary: 'راهکارهای عملی برای حفاظت از اطلاعات' },
  { title: 'طراحی UI/UX مدرن', content: 'طراحی رابط کاربری و تجربه کاربری یکی از مهم‌ترین عوامل موفقیت محصولات دیجیتال است. طراحی خوب نه تنها زیبایی بصری را فراهم می‌کند بلکه کاربرد آسان و لذت‌بخش را نیز تضمین می‌کند. در این مقاله اصول طراحی مدرن، استفاده از رنگ‌ها، تایپوگرافی، فضای خالی و سایر عناصر طراحی را بررسی می‌کنیم.', summary: 'اصول و تکنیک‌های طراحی رابط کاربری مدرن' },
  { title: 'آموزش Node.js برای بک‌اند', content: 'Node.js یکی از محبوب‌ترین پلتفرم‌های توسعه بک‌اند است که امکان استفاده از JavaScript در سمت سرور را فراهم می‌کند. این پلتفرم به دلیل سرعت بالا، مقیاس‌پذیری و اکوسیستم غنی NPM، انتخاب اول بسیاری از توسعه‌دهندگان است. در این آموزش از نصب Node.js تا ساخت API کامل را یاد خواهیم گرفت.', summary: 'راهنمای جامع توسعه بک‌اند با Node.js' },
  { title: 'مقدمه‌ای بر بلاک چین', content: 'بلاک چین فناوری انقلابی است که پایه ارزهای دیجیتال مثل بیت کوین را تشکیل می‌دهد. این فناوری امکان ذخیره‌سازی امن و غیرمتمرکز اطلاعات را فراهم می‌کند. در این مقاله به بررسی مفاهیم پایه بلاک چین، نحوه عملکرد آن، کاربردهای مختلف و آینده این فناوری می‌پردازیم.', summary: 'آشنایی با مفاهیم پایه فناوری بلاک چین' },
  { title: 'استراتژی‌های بازاریابی دیجیتال', content: 'بازاریابی دیجیتال در عصر حاضر یکی از مهم‌ترین ابزارهای رشد کسب‌وکار است. از SEO و تولید محتوا گرفته تا تبلیغات در شبکه‌های اجتماعی و ایمیل مارکتینگ، روش‌های مختلفی برای جذب مشتری وجود دارد. در این مقاله استراتژی‌های مؤثر بازاریابی دیجیتال را بررسی می‌کنیم.', summary: 'روش‌های مؤثر بازاریابی در فضای دیجیتال' },
  { title: 'آموزش Python برای علم داده', content: 'Python یکی از محبوب‌ترین زبان‌های برنامه‌نویسی برای علم داده و یادگیری ماشین است. کتابخانه‌های قدرتمندی مثل Pandas، NumPy، Matplotlib و Scikit-learn امکانات فوق‌العاده‌ای برای تحلیل داده فراهم می‌کنند. در این آموزش از مبانی Python تا پیاده‌سازی الگوریتم‌های یادگیری ماشین را یاد خواهیم گرفت.', summary: 'راهنمای کامل Python برای تحلیل داده' },
  { title: 'توسعه اپلیکیشن موبایل با React Native', content: 'React Native فریمورک قدرتمندی برای توسعه اپلیکیشن‌های موبایل کراس پلتفرم است. با استفاده از این فریمورک می‌توان با یک کدبیس واحد، اپلیکیشن‌هایی برای iOS و Android توسعه داد. در این مقاله مزایا، معایب و نحوه شروع کار با React Native را بررسی می‌کنیم.', summary: 'آموزش توسعه اپ موبایل کراس پلتفرم' },
  { title: 'مدیریت پروژه با روش Agile', content: 'روش Agile یکی از محبوب‌ترین متدولوژی‌های مدیریت پروژه در صنعت نرم‌افزار است. این روش بر انعطاف‌پذیری، همکاری تیمی و تحویل سریع محصول تأکید دارد. در این مقاله اصول Agile، فریمورک‌های مختلف مثل Scrum و Kanban و نحوه پیاده‌سازی آن‌ها را بررسی می‌کنیم.', summary: 'راهنمای عملی مدیریت پروژه چابک' }
];

const generateMorePosts = () => {
  const topics = ['فناوری', 'برنامه‌نویسی', 'کسب‌وکار', 'طراحی', 'علم داده', 'امنیت', 'موبایل', 'وب'];
  const titles = [
    'راهنمای کامل {topic}', 'آموزش پیشرفته {topic}', 'بهترین روش‌های {topic}',
    'آینده {topic} در ایران', 'تکنیک‌های مدرن {topic}', 'اصول {topic} برای مبتدیان',
    'پروژه‌های عملی {topic}', 'ابزارهای {topic}', 'چالش‌های {topic}', 'نوآوری‌های {topic}'
  ];
  
  const posts = [];
  for (let i = 0; i < 30; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const titleTemplate = titles[Math.floor(Math.random() * titles.length)];
    const title = titleTemplate.replace('{topic}', topic);
    
    posts.push({
      title,
      content: `این مقاله در مورد ${topic} نوشته شده است. محتوای کاملی در مورد ${topic} و کاربردهای آن ارائه می‌دهد. در ادامه به بررسی جزئیات بیشتر می‌پردازیم. ${topic} یکی از مهم‌ترین موضوعات در حوزه فناوری محسوب می‌شود که کاربردهای فراوانی دارد. در این مقاله سعی کرده‌ایم تا تمام جنبه‌های مهم ${topic} را پوشش دهیم.`,
      summary: `خلاصه‌ای از مقاله ${topic} که نکات کلیدی را پوشش می‌دهد.`
    });
  }
  return posts;
};

const commentTexts = [
  'مقاله بسیار مفیدی بود، ممنون از اشتراک',
  'نکات جالبی مطرح کردید، آیا منابع بیشتری معرفی می‌کنید؟',
  'عالی بود، منتظر مقالات بعدی هستم',
  'خیلی کاربردی بود، تشکر',
  'سوال: آیا این روش در پروژه‌های بزرگ هم کارآمد است؟',
  'تجربه شخصی من متفاوت بوده، اما نکات خوبی داشت',
  'آیا می‌توانید مثال عملی بیشتری ارائه دهید؟',
  'بسیار آموزنده بود، سپاس',
  'نظر جالبی است، اما فکر می‌کنم نکته‌ای فراموش شده',
  'کاملاً موافقم با نظرتان',
  'مقاله خوبی بود اما می‌توانست جامع‌تر باشد',
  'ممنون از توضیحات واضح',
  'آیا برای مبتدیان مناسب است؟',
  'تجربه عملی من این موضوع را تأیید می‌کند',
  'نکات فنی خوبی مطرح شده'
];

const notificationMessages = [
  'پست جدیدی منتشر شد',
  'نظر شما تایید شد',
  'کاربر جدیدی شما را دنبال کرد',
  'پست شما لایک شد',
  'نظر جدیدی روی پست شما ثبت شد',
  'پست شما در موضوع جدیدی دسته‌بندی شد'
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('1234', 10);
    const users = [];
    
    for (const userData of sampleUsers) {
      const user = new User({
        ...userData,
        password: hashedPassword,
        bio: `سلام، من ${userData.name} هستم و علاقه‌مند به فناوری و نوشتن مقاله هستم.`,
        avatar: `https://www.gravatar.com/avatar/${Math.random().toString(36).substring(7)}?d=mp&f=y`
      });
      await user.save();
      users.push(user);
    }

    console.log('Creating topics...');
    const topics = [];
    for (const topicData of sampleTopics) {
      const topic = new Topic(topicData);
      await topic.save();
      topics.push(topic);
    }

    console.log('Creating posts...');
    const allPosts = [...samplePosts, ...generateMorePosts()];
    const posts = [];
    
    for (let i = 0; i < allPosts.length; i++) {
      const postData = allPosts[i];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomTopics = topics.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
      
      const post = new Post({
        ...postData,
        author: randomUser._id,
        topics: randomTopics.map(t => t._id),
        tags: ['تکنولوژی', 'آموزش', 'مقاله'].sort(() => 0.5 - Math.random()).slice(0, 2),
        estimatedReadTime: Math.floor(Math.random() * 10) + 1,
        isPublished: true,
        views: Array(7).fill(0).map(() => Math.floor(Math.random() * 100)),
        rating: Math.floor(Math.random() * 5) + 1,
        ratingCount: Math.floor(Math.random() * 50) + 1
      });
      await post.save();
      posts.push(post);
    }

    console.log('Creating comments...');
    for (const post of posts) {
      const numComments = Math.floor(Math.random() * 30) + 1;
      for (let i = 0; i < numComments; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomText = commentTexts[Math.floor(Math.random() * commentTexts.length)];
        
        const comment = new Comment({
          content: randomText,
          userId: randomUser._id,
          postId: post._id,
          status: Math.random() > 0.3 ? 'approved' : 'pending'
        });
        await comment.save();
      }
    }

    console.log('Creating notifications...');
    for (const user of users) {
      const numNotifications = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < numNotifications; i++) {
        const randomMessage = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];
        const randomPost = posts[Math.floor(Math.random() * posts.length)];
        const randomUser2 = users[Math.floor(Math.random() * users.length)];
        
        const notification = new Notification({
          user: user._id,
          type: ['newPost', 'newComment', 'newLike', 'newFollower'][Math.floor(Math.random() * 4)],
          message: randomMessage,
          relatedPost: Math.random() > 0.5 ? randomPost._id : null,
          relatedUser: Math.random() > 0.5 ? randomUser2._id : null,
          isRead: Math.random() > 0.7
        });
        await notification.save();
      }
    }

    console.log('Sample data created successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${topics.length} topics`);
    console.log(`Created ${posts.length} posts`);
    console.log('All users password: 1234');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();