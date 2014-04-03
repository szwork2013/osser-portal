var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OssDocumentSchema = new Schema({
    nid: {
        type: Schema.Types.ObjectId,
        ref: 'contentnode'
    },
    name: {
        type: String,
        required: true
    }, // ソフトウェア名称＋一語
    nickname: {
        type: String
    }, // あだ名
    logo: {
        type: String
    }, // ロゴパス
    weight: {
        type: Number
    }, // 表示ウエイト
    summary: {
        type: String
    }, // サマリー
    content: {
        type: String
    }, // ソフトウェア説明
    homepage: {
        type: String
    }, // ホームページURL
    apidocument: {
        type: String
    }, // ドキュメントURL
    download: {
        type: String
    }, // ダウンロードURL
    refurl: {
        type: String
    }, // 参照URL
    ispublished: {
        type: Boolean
    }, // 掲載フラグ
    isshowtop: {
        type: Boolean
    }, // トップページ表示フラグ（TOPページにあるOSS一覧に表示、基本は小さいOSSは自分のカテゴリにしか表示させないため）
    isrecommended: {
        type: Boolean
    }, // osser.jpからの推奨OSS
    regdate: {
        type: Date,
        default: Date.now
    }, // 登録日
    upddate: {
        type: Date,
        default: Date.now
    } // 更新日
});

mongoose.model('ossdocument', OssDocumentSchema);