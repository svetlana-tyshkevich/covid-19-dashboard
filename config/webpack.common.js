// ? Небольшая превьюшка
// ? (Приятней читать если вы пользуетесь VScode и используете расширение "Better comments")
// ? Основная структура взята с https://github.com/taniarascia/webpack-boilerplate но имеет значительные переделки :)
/* 
* 1. Импорт изображений идет путем относительного пути от html файла (пример в index.js)
*
* 2. Если нужно добавить иморт с других папок то прописываем в new CopyPlugin... тут чуть ниже
* Использование CopyPlugin оправданно тем что при стандартном импорте import img from "./img/..."
* Есть куча заморочек с расширениями файлов тк нужно делать гнератор под каждый формат файлов и
* потом пути в css файле тоже коверкаются( об этом и говорил, пока над решением не заморачивался.
*
* 3. SVG можно импортить стандартным способом import img from "./img/..." и оно заинлайнится в код.
* (Не знаю что у меня забыло test: /\.(?:ico|gif|png|jpg|jpeg)$/i, по этому можно удалить по идее)
* 
* 4. В остальном все по канону, можно спокойно разбивать на модули любые штуки,
* eslint вам все расскажет в консоли если что не так)
*
* 5. По настройкам игнора, линтер игнорирует prod версию, то есть папку dist,
* тк кому нужно линтить бандл ¯\_(ツ)_/¯
*
* 6. Линтер использует базу airbnb-base как по курсу везде требуется) + фичи ESnext включены)
*
* 7. На случай если кто не пользовался sass/scss можно конечно перенастроить,
* но для удобства думаю будет правильней просто писать в scss файле код простым css и импортить в index.scss
*
* WARNING!!!
* На случай если вы копируете просто файлы с папки, тут есть скрытые файлы и что бы не нарушать
* структуру копируйте целой папкой либо смотрите скрытые файлы
*
* Использование все по стандарту, на всякий распишу все ¯\_(ツ)_/¯
*
* Перед началом работы не забудьте установить все пакеты npm i
* npm start - dev режим + webpack-server сразу показывающий все в браузере)
* npm run build - prod режим, все содержимое с src перемещается в папку dist в корне, + html, scss и js
* 
* Так же в index.js уже есть код с которым можно поиграть с импортами)
*/

const paths = require('./paths')

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: [paths.src + '/index.js'],

  output: {
    path: paths.build,
    publicPath: './',
    filename: '[name].bundle.js',
    assetModuleFilename: 'images/[name][ext][query]',
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/images", to: "images" },
        { from: "src/audio", to: "audio" },
      ],
    }),

    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      title: 'COVID-19 Dashboard',
      favicon: paths.src + '/images/favicon.ico',
      template: paths.src + '/template.html',
      filename: 'index.html',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },

      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
        ],
      },

      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },

      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline'
      },
    ],
  },
}