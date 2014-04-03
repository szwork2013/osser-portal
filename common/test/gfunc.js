var should = require('should');
var common = require('../');

describe('gfunc', function () {
    it('encrypt/decrypt', function (done) {
        test_encrypt_decrypt('');
        test_encrypt_decrypt('i love you.');
        test_encrypt_decrypt('日本語テスト　テスト日本語');
        test_encrypt_decrypt('GitHub（ギットハブ）はソフトウェア開発プロジェクトのための共有ウェブサービスであり、Gitバージョン管理システムを使用する。 Ruby on RailsおよびErlangで記述されており、GitHub社によって保守されている。 主な開発者はChris Wanstrath、PJ Hyett、Tom Preston-Wernerである。 GitHub商用プランおよびオープンソースプロジェクト向けの無料アカウントを提供している。 2009年のユーザー調査によると、GitHubは最もポピュラーなGitホスティングサイトとなった。');
        test_encrypt_decrypt('Drupal(発音: /ˈdruːpəl/)は、プログラム言語PHPで記述されたフリーでオープンソースのモジュラー式フレームワークであり、コンテンツ管理システム（CMS）である。昨今の多くのCMSと同様に、Drupalはシステム管理者にコンテンツの作成と整理、提示方法のカスタマイズ、管理作業の自動化、サイトへの訪問者や寄稿者の管理を可能にする。その性能がコンテンツ管理から、幅広いサービスや商取引を可能にするにまで及ぶことから、Drupalは時々「ウェブアプリケーションフレームワーク」であると評される。Drupalは洗練されたプログラミング・インターフェースを提供するものの、基本的なウェブサイトの設置と管理はプログラミングなしに成し遂げることができる。Drupalは一般に、最も優れたWeb 2.0フレームワークの一つであると考えられている。DrupalはWindows、Mac OS X、Linux、FreeBSD、OpenBSD、Solaris 10、 OpenSolarisを始め、ウェブサーバーApache（1.3以上）またはIIS（IIS5以上）、及びPHP言語（4.3.3以上）をサポートするあらゆる環境で動作する。Drupalはコンテンツや設定を格納するために、MySQL、PostgreSQL、SQLite、MongoDBのようなデータベース管理システムを必要とする。Drupalコア・モジュールDrupalコアはさらに、コアのみで作成したウェブサイトの標準の機能性を、管理者が拡張することのできる「コア・モジュール」を備えている。コアのDrupalディストリビューションは、以下を含む多くの機能を提供している。複数ユーザによるコンテンツの作成・編集高度な検索機能コメント、フォーラム、投票ユーザ・プロフィール多層式のメニュー・システムRSSフィードとフィード・アグリゲーター様々なアクセス・コントロール制限（ユーザロール、IPアドレス、電子メール）アクセス統計とログ記録高負荷状態でのパフォーマンスを向上させるキャッシュと機能調整機能（スロットル）説明的なURL（例えば "www.example.com/?q=node/432" ではなく "www.example.com/products" のようなもの）ワークフロー・ツール（「トリガ」と「アクション」）セキュリティ・リリースや新機能リリースのアップデート通知OpenIDのサポート');
        done();
    });

    it('getpager', function (done) {
        var pager = common.gfunc.getpager(29, 1, 20, 7);
        //console.log(pager);
        pager.first.should.equal(0);
        pager.last.should.equal(0);
        pager.pages.length.should.equal(2);
        pager.pages[0].should.equal(1);
        pager.pages[1].should.equal(2);

        pager = common.gfunc.getpager(99, 1, 20, 7);
        //console.log(pager);
        pager.first.should.equal(0);
        pager.last.should.equal(0);
        pager.pages.length.should.equal(5);
        pager.pages[0].should.equal(1);
        pager.pages[1].should.equal(2);
        pager.pages[2].should.equal(3);
        pager.pages[3].should.equal(4);
        pager.pages[4].should.equal(5);

        pager = common.gfunc.getpager(0, 1, 20, 7);
        //console.log(pager);
        pager.first.should.equal(0);
        pager.last.should.equal(0);
        pager.pages.length.should.equal(1);
        pager.pages[0].should.equal(1);

        pager = common.gfunc.getpager(10, 1, 20, 7);
        //console.log(pager);
        pager.first.should.equal(0);
        pager.last.should.equal(0);
        pager.pages.length.should.equal(1);
        pager.pages[0].should.equal(1);

        pager = common.gfunc.getpager(20, 1, 20, 7);
        //console.log(pager);
        pager.first.should.equal(0);
        pager.last.should.equal(0);
        pager.pages.length.should.equal(1);
        pager.pages[0].should.equal(1);

        pager = common.gfunc.getpager(35, 1, 20, 7);
        //console.log(pager);
        pager.first.should.equal(0);
        pager.last.should.equal(0);
        pager.pages.length.should.equal(2);
        pager.pages[0].should.equal(1);
        pager.pages[1].should.equal(2);

        pager = common.gfunc.getpager(100, 1, 20, 7);
        //console.log(pager);
        pager.first.should.equal(0);
        pager.last.should.equal(0);
        pager.pages.length.should.equal(5);
        pager.pages[0].should.equal(1);
        pager.pages[1].should.equal(2);
        pager.pages[2].should.equal(3);
        pager.pages[3].should.equal(4);
        pager.pages[4].should.equal(5);

        pager = common.gfunc.getpager(140, 1, 20, 7);
        //console.log(pager);
        pager.first.should.equal(0);
        pager.last.should.equal(0);
        pager.pages.length.should.equal(7);
        pager.pages[0].should.equal(1);
        pager.pages[1].should.equal(2);
        pager.pages[2].should.equal(3);
        pager.pages[3].should.equal(4);
        pager.pages[4].should.equal(5);
        pager.pages[5].should.equal(6);
        pager.pages[6].should.equal(7);

        pager = common.gfunc.getpager(141, 1, 20, 7);
        //console.log(pager);
        pager.first.should.equal(0);
        pager.last.should.equal(8);
        pager.pages.length.should.equal(7);
        pager.pages[0].should.equal(1);
        pager.pages[1].should.equal(2);
        pager.pages[2].should.equal(3);
        pager.pages[3].should.equal(4);
        pager.pages[4].should.equal(5);
        pager.pages[5].should.equal(6);
        pager.pages[6].should.equal(7);

        pager = common.gfunc.getpager(999, 1, 20, 7);
        pager.first.should.equal(0);
        pager.last.should.equal(50);
        pager.pages.length.should.equal(7);
        pager.pages[0].should.equal(1);
        pager.pages[1].should.equal(2);
        pager.pages[2].should.equal(3);
        pager.pages[3].should.equal(4);
        pager.pages[4].should.equal(5);
        pager.pages[5].should.equal(6);
        pager.pages[6].should.equal(7);

        pager = common.gfunc.getpager(999, 2, 20, 7);
        pager.first.should.equal(0);
        pager.last.should.equal(50);
        pager.pages.length.should.equal(7);
        pager.pages[0].should.equal(1);
        pager.pages[1].should.equal(2);
        pager.pages[2].should.equal(3);
        pager.pages[3].should.equal(4);
        pager.pages[4].should.equal(5);
        pager.pages[5].should.equal(6);
        pager.pages[6].should.equal(7);

        pager = common.gfunc.getpager(999, 3, 20, 7);
        pager.first.should.equal(0);
        pager.last.should.equal(50);
        pager.pages.length.should.equal(7);
        pager.pages[0].should.equal(1);
        pager.pages[1].should.equal(2);
        pager.pages[2].should.equal(3);
        pager.pages[3].should.equal(4);
        pager.pages[4].should.equal(5);
        pager.pages[5].should.equal(6);
        pager.pages[6].should.equal(7);

        pager = common.gfunc.getpager(999, 4, 20, 7);
        pager.first.should.equal(0);
        pager.last.should.equal(50);
        pager.pages.length.should.equal(7);
        pager.pages[0].should.equal(1);
        pager.pages[1].should.equal(2);
        pager.pages[2].should.equal(3);
        pager.pages[3].should.equal(4);
        pager.pages[4].should.equal(5);
        pager.pages[5].should.equal(6);
        pager.pages[6].should.equal(7);

        pager = common.gfunc.getpager(999, 5, 20, 7);
        pager.first.should.equal(1);
        pager.last.should.equal(50);
        pager.pages.length.should.equal(7);
        pager.pages[0].should.equal(2);
        pager.pages[1].should.equal(3);
        pager.pages[2].should.equal(4);
        pager.pages[3].should.equal(5);
        pager.pages[4].should.equal(6);
        pager.pages[5].should.equal(7);
        pager.pages[6].should.equal(8);

        pager = common.gfunc.getpager(999, 45, 20, 7);
        pager.first.should.equal(1);
        pager.last.should.equal(50);
        pager.pages.length.should.equal(7);
        pager.pages[0].should.equal(42);
        pager.pages[1].should.equal(43);
        pager.pages[2].should.equal(44);
        pager.pages[3].should.equal(45);
        pager.pages[4].should.equal(46);
        pager.pages[5].should.equal(47);
        pager.pages[6].should.equal(48);

        pager = common.gfunc.getpager(999, 46, 20, 7);
        pager.first.should.equal(1);
        pager.last.should.equal(50);
        pager.pages.length.should.equal(7);
        pager.pages[0].should.equal(43);
        pager.pages[1].should.equal(44);
        pager.pages[2].should.equal(45);
        pager.pages[3].should.equal(46);
        pager.pages[4].should.equal(47);
        pager.pages[5].should.equal(48);
        pager.pages[6].should.equal(49);

        pager = common.gfunc.getpager(999, 47, 20, 7);
        pager.first.should.equal(1);
        pager.last.should.equal(0);
        pager.pages.length.should.equal(7);
        pager.pages[0].should.equal(44);
        pager.pages[1].should.equal(45);
        pager.pages[2].should.equal(46);
        pager.pages[3].should.equal(47);
        pager.pages[4].should.equal(48);
        pager.pages[5].should.equal(49);
        pager.pages[6].should.equal(50);

        pager = common.gfunc.getpager(999, 48, 20, 7);
        pager.first.should.equal(1);
        pager.last.should.equal(0);
        pager.pages.length.should.equal(7);
        pager.pages[0].should.equal(44);
        pager.pages[1].should.equal(45);
        pager.pages[2].should.equal(46);
        pager.pages[3].should.equal(47);
        pager.pages[4].should.equal(48);
        pager.pages[5].should.equal(49);
        pager.pages[6].should.equal(50);

        pager = common.gfunc.getpager(999, 49, 20, 7);
        pager.first.should.equal(1);
        pager.last.should.equal(0);
        pager.pages.length.should.equal(7);
        pager.pages[0].should.equal(44);
        pager.pages[1].should.equal(45);
        pager.pages[2].should.equal(46);
        pager.pages[3].should.equal(47);
        pager.pages[4].should.equal(48);
        pager.pages[5].should.equal(49);
        pager.pages[6].should.equal(50);

        pager = common.gfunc.getpager(999, 50, 20, 7);
        pager.first.should.equal(1);
        pager.last.should.equal(0);
        pager.pages.length.should.equal(7);
        pager.pages[0].should.equal(44);
        pager.pages[1].should.equal(45);
        pager.pages[2].should.equal(46);
        pager.pages[3].should.equal(47);
        pager.pages[4].should.equal(48);
        pager.pages[5].should.equal(49);
        pager.pages[6].should.equal(50);

        done();
    });

    it('getpager-default', function () {
        var pager = {};
        pager = common.gfunc.getpager(789, 5);
        //console.log(pager);
    });

    it('cloneObj', function () {
        var data = {
            a: 1,
            b: 'bbb',
            c: [1, 2, 3]
        };
        var datacopy = common.gfunc.cloneObj(data);
        datacopy.a.should.equal(data.a);
        datacopy.b.should.equal(data.b);
        datacopy.c.length.should.equal(data.c.length);
        datacopy.c[0].should.equal(data.c[0]);
        datacopy.c[1].should.equal(data.c[1]);
        datacopy.c[2].should.equal(data.c[2]);
    });
    
    it('個人ロゴランダム作成', function(){
//        console.log(common.gfunc.getRandomPersonalLogo());
//        console.log(common.gfunc.getRandomPersonalLogo());
//        console.log(common.gfunc.getRandomPersonalLogo());
//        console.log(common.gfunc.getRandomPersonalLogo());
//        console.log(common.gfunc.getRandomPersonalLogo());
    });
    
    it('endsWith', function(){
        common.gfunc.endsWith('/images/avatar/apple.png', '8ball.png').should.equal(false);
        common.gfunc.endsWith('/images/avatar/apple.png', 'apple.png').should.equal(true);
    });
});

function test_encrypt_decrypt(content) {
    var result = '';
    result = common.gfunc.encrypt(content, common.gconfig.secret_key);
    result = common.gfunc.decrypt(result, common.gconfig.secret_key);
    result.should.equal(content);
}