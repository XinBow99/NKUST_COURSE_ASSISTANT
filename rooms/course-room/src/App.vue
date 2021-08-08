<template>
  <div id="app">
    <b-container fluid>
      <b-row>
        <sidebar />
        <router-view />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import sidebar from './components/sidebar.vue'
export default {
  components: { sidebar },
  name: 'message'
}
</script>

<style>
@charset "UTF-8";
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}

ol,
ul {
  list-style: none;
}

blockquote,
q {
  quotes: none;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
  content: '';
  content: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

a {
  vertical-align: middle;
}

img {
  max-width: 100%;
  vertical-align: middle;
}

button {
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  background-color: unset;
  color: unset;
}

canvas {
  max-width: 100%;
}

i {
  font-style: normal;
}

html {
  height: 100%;
}

body {
  font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, 'Lucida Grande',
    'PingFang TC', '蘋果儷中黑', 'Apple LiGothic Medium', sans-serif;
  color: #666666;
}

a {
  color: #007ca7;
}

a:hover {
  color: #009ad0;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
</style>
