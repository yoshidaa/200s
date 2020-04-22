# 200s
codes for DARTSLIVE 200s

* ためしてみるには
    * DARTSLIVE 200s を起動した状態でブラウザを開き、下記のページにアクセスしてください
    * [Unlimited COUNT-UP](https://yoshidaa.github.io/200s/proto/)
* いろいろメモ
    * DARTSLIVE 200s はキーボードとして認識されている
        * 場所によって異なるキー入力が端末に送信されるしくみ
        * 各セグメントと入力されるキーコードの対応はボードごとに異なる
            * 下記に同じようなことに挑戦している記事があるが、私の 200s は以下の 2 つとも違った。
                * [年末年始の遊びはこれで決まり！ -家庭用ダーツをもっと楽しむHack術 – PSYENCE:MEDIA](https://tech.recruit-mp.co.jp/gadget/post-14929/)
                * [DARTSLIVEでハックせよ 〜 これが本当のダーツ駆動開発です！ | 株式会社インフィニットループ技術ブログ](https://www.infiniteloop.co.jp/blog/2016/01/dartslive_as_keyboard/)
            * ひとまずは boardmap.js に分離した
            * [初期化のときに入力するコードによって変わるのでは？](https://twitter.com/NAOKI_MIKUMA/status/1252665579464355841?s=20) 説が現時点では有力か
            * 公式の意図する使い方じゃないはずなので仕方ないか。。

    * 効果音とかアワードムービーは権利的な問題でアップロードはできない
        * が、たとえばここで参照することができる
            * LOWTON : https://youtu.be/oGPbkTGjPCo
            * HAT TRICK : https://youtu.be/0yVMvq5Xhmg
            * THREE IN THE BLACK : https://youtu.be/9eHstT3XeXQ
            * WHITE HORSE : https://youtu.be/xzFmGcdAGFw
            * HIGH TON : https://youtu.be/QmsNx2-Uf9I
            * TON80 : https://youtu.be/H_lfAwhnu68
        * これを使えばアップロードなしで直接参照できるかもしれない。タイムラグが気になるが。。
            * [iframe 組み込みの YouTube Player API リファレンス](https://developers.google.com/youtube/iframe_api_reference?hl=ja#Loading_a_Video_Player)
        * Bull や TRIPLE の音も YouTube の各種映像からがんばって抜き出したが、、
