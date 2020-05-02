# YDarts with DARTSLIVE 200s

* これは何？
    * DARTSLIVE 200s が Bluetooth のキーボードになっていることを利用して作った Phoenix Darts ライクな見た目のダーツアプリです

* ためしてみる
    * DARTSLIVE 200s を起動した状態でブラウザを開き、下記のページにアクセスしてください
        * https://yoshidaa.github.io/200s/
        * Android の場合は↑をホーム画面に追加すると全画面で遊べます
    * 初回プレイ時にはボードのマッピングの設定をする必要があります
    * とりあえず COUNT UP と BIG BULL と 01 (SINGLE OUTのみ) をできます
    * 横幅 1280 のタブレット前提で作ってしまってるので、環境によっては表示がおかしいかも

* 技術的なメモ
    * この後の実装は未定
    * DARTSLIVE 200s はキーボードとして認識されている
        * 場所によって異なるキー入力が端末に送信されるしくみ
        * 各セグメントと入力されるキーコードの対応は機器認証時に入力される 4 桁のコードによって異なるようだ
            * [初期化のときに入力するコードによって変わるのでは？](https://twitter.com/NAOKI_MIKUMA/status/1252665579464355841?s=20) 説が有力
    * 効果音とかアワードムービーは権利上の問題で使いにくい
        * たとえばここで参照することができる
            * LOWTON : https://youtu.be/oGPbkTGjPCo
            * HAT TRICK : https://youtu.be/0yVMvq5Xhmg
            * THREE IN THE BLACK : https://youtu.be/9eHstT3XeXQ
            * WHITE HORSE : https://youtu.be/xzFmGcdAGFw
            * HIGH TON : https://youtu.be/QmsNx2-Uf9I
            * TON80 : https://youtu.be/H_lfAwhnu68
        * これを使えばアップロードなしで直接参照できるかもしれない。タイムラグが気になるが。。
            * [iframe 組み込みの YouTube Player API リファレンス](https://developers.google.com/youtube/iframe_api_reference?hl=ja#Loading_a_Video_Player)
            * 二次利用なのでこれは黒に近いグレーゾーン
                * [ゲーム画面への動画埋め込みは規約に抵触しますか？](https://support.google.com/youtube/thread/12918728?hl=ja)
        * おすすめはローカルの Web Server にこのリポジトリを clone して sound/ と movie/ に各種ファイルを入れる
