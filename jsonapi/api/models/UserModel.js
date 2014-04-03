var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var common = require('../../../common');

var UserSchema = new Schema({
    username: {
        type: String,
        required: true
    }, //ユーザー表示名
    email: {
        type: String,
        trim: true,
        index: {
            unique: true,
            sparse: true
        }
    }, // メールアドレス
    password: {
        type: String
    }, // パスワード
    sex: {
        type: String,
        default: ''
    }, //性別
    prefecture: {
        type: String
    }, //都道府県
    status: {
        type: String,
        default: 'アクティブ'
    }, // アクティブ/ロック
    isadmin: {
        type: Boolean,
        default: false
    }, //管理者
    isemailauth: {
        type: Boolean,
        default: false
    }, // メール認証済み
    myurl: {
        type: String,
        trim: true,
        lowercase: true,
        index: {
            unique: true,
            sparse: true
        }
    }, // /my/:myurl
    mylogo: {
        type: String,
        trim: true
    }, //mylogo-url
    mylogotype: {
        type: String
    }, // Gravatar;外部リンク;サイト画像
    appeal: {
        type: String,
        default: ''
    }, //自分のアピール
    experience: {
        type: Number,
        default: 0
    }, //経験値
    threadcount: {
        type: Number,
        default: 0
    }, //投稿数
    commentcount: {
        type: Number,
        default: 0
    }, //コメント数
    regdate: {
        type: Date,
        default: Date.now
    }, //登録日付
    //----------------------------//
    homepage: {
        type: String
    }, //ホームページ
    jobtype: {
        type: String
    }, //職種
    jobstatus: {
        type: String
    }, //ジョブステータス：学生、就活中、就職
    jobyears: {
        type: String
    }, //経験年数
    devplatform: [{
        type: String
    }], //開発言語
    specializedarea: [{
        type: String
    }], //専門領域
    //----------------------------//
    upddate: {
        type: Date,
        default: Date.now
    },
    lastaccessdate: {
        type: Date,
        default: Date.now
    }
});

//UserSchema.virtual('auto.mylogo').get(function () {
//    return this.mylogotype === 'Gravatar' ? common.gfunc.getGravatarUrl(this.email) : (this.mylogo ? this.mylogo : common.gconfig.url.image.osser_logo);
//});

mongoose.model('user', UserSchema);