Markdown Basics （快速入门）
--------------------------

参照：[http://wowubuntu.com/markdown/](http://wowubuntu.com/markdown/)

###段落、标题、区块代码

一个段落是由一个以上的连接的行句组成，而一个以上的空行则会划分出不同的段落（空行的定义是显示上看起来像是空行，就被视为空行，例如有一行只有空白和 tab，那该行也会被视为空行），一般的段落不需要用空白或换行缩进。

Markdown 支持两种标题的语法，Setext 和 atx 形式。Setext 形式是用底线的形式，利用 = （最高阶标题）和 - （第二阶标题），Atx 形式在行首插入 1 到 6 个 # ，对应到标题 1 到 6 阶。

区块引用则使用 email 形式的 '>' 角括号。

####Markdown 语法:


<pre><code>A First Level Header
====================
A Second Level Header
---------------------

Now is the time for all good men to come to
the aid of their country. This is just a
regular paragraph.

The quick brown fox jumped over the lazy
dog's back.
### Header 3

> This is a blockquote.
> 
> This is the second paragraph in the blockquote.
>
> ## This is an H2 in a blockquote
</code></pre>

####处理结果

<pre><code>&lt;h1&gt;A First Level Header&lt;/h1&gt;
&lt;h2&gt;A Second Level Header&lt;/h2&gt;
&lt;p&gt;Now is the time for all good men to come to
the aid of their country. This is just a
regular paragraph.&lt;/p&gt;
&lt;p&gt;The quick brown fox jumped over the lazy
dog's back.&lt;/p&gt;
&lt;h3&gt;Header 3&lt;/h3&gt;
&lt;blockquote&gt;
&lt;p&gt;This is a blockquote.&lt;/p&gt;
&lt;p&gt;This is the second paragraph in the blockquote.&lt;/p&gt;
&lt;h2&gt;This is an H2 in a blockquote&lt;/h2&gt;
&lt;/blockquote&gt;
</code></pre>

###修辞和强调

Markdown 使用星号和底线来标记需要强调的区段。

####Markdown 语法:

<pre><code>Some of these words *are emphasized*.
Some of these words _are emphasized also_.
Use two asterisks for **strong emphasis**.
Or, if you prefer, __use two underscores instead__.
</code></pre>

####处理结果

<pre><code><p>Some of these words <em>are emphasized</em>.
Some of these words <em>are emphasized also</em>.</p>
<p>Use two asterisks for <strong>strong emphasis</strong>.
Or, if you prefer, <strong>use two underscores instead</strong>.</p>
</code></pre>

###列表

无序列表使用星号、加号和减号来做为列表的项目标记，这些符号是都可以使用的，使用星号：

<pre><code>* Candy.
* Gum.
* Booze.
</code></pre>

####加号：

<pre><code>+ Candy.
+ Gum.
+ Booze.
</code></pre>

####和减号

<pre><code>- Candy.
- Gum.
- Booze.
</code></pre>

####处理结果

<pre><code><ul>
<li>Candy.</li>
<li>Gum.</li>
<li>Booze.</li>
</ul>
</code></pre>

有序的列表则是使用一般的数字接着一个英文句点作为项目标记：

<pre><code>1. Red
2. Green
3. Blue
</code></pre>

####处理结果

<pre><code><ol>
<li>Red</li>
<li>Green</li>
<li>Blue</li>
</ol>
</code></pre>

如果你在项目之间插入空行，那项目的内容会用 <p> 包起来，你也可以在一个项目内放上多个段落，只要在它前面缩排 4 个空白或 1 个 tab 。

<pre><code>* A list item.
With multiple paragraphs.

* Another item in the list.
</code></pre>

####处理结果

<pre><code><ul>
<li><p>A list item.</p>
<p>With multiple paragraphs.</p></li>
<li><p>Another item in the list.</p></li>
</ul>
</code></pre>

###链接

Markdown 支援两种形式的链接语法： 行内 和 参考 两种形式，两种都是使用角括号来把文字转成连结。

行内形式是直接在后面用括号直接接上链接：

<pre><code>
This is an [example link](http://example.com/).
</code></pre>

####处理结果

<pre><code>
&lt;p&gt;This is an &lt;a href=&quot;http://example.com/&quot;&gt;
example link&lt;/a&gt;.&lt;/p&gt;
</code></pre>

你也可以选择性的加上 title 属性：

<pre><code>
This is an [example link](http://example.com/ "With a Title").
</code></pre>

####处理结果

<pre><code>
&lt;p&gt;This is an &lt;a href=&quot;http://example.com/&quot; title=&quot;With a Title&quot;&gt;
example link&lt;/a&gt;.&lt;/p&gt;
</code></pre>

参考形式的链接让你可以为链接定一个名称，之后你可以在文件的其他地方定义该链接的内容：

<pre><code>
I get 10 times more traffic from [Google][1] than from
[Yahoo][2] or [MSN][3].

[1]: http://google.com/ "Google"
[2]: http://search.yahoo.com/ "Yahoo Search"
[3]: http://search.msn.com/ "MSN Search"
</code></pre>

####处理结果

<pre><code>
&lt;p&gt;I get 10 times more traffic from &lt;a href=&quot;http://google.com/&quot;
title=&quot;Google&quot;&gt;Google&lt;/a&gt; than from &lt;a href=&quot;http://search.yahoo.com/&quot;
title=&quot;Yahoo Search&quot;&gt;Yahoo&lt;/a&gt; or &lt;a href=&quot;http://search.msn.com/&quot;
title=&quot;MSN Search&quot;&gt;MSN&lt;/a&gt;.&lt;/p&gt;
</code></pre>

title 属性是选择性的，链接名称可以用字母、数字和空格，但是不分大小写：

<pre><code>
I start my morning with a cup of coffee and
[The New York Times][NY Times].

[ny times]: http://www.nytimes.com/
</code></pre>

####处理结果

<pre><code>
&lt;p&gt;I start my morning with a cup of coffee and
&lt;a href=&quot;http://www.nytimes.com/&quot;&gt;The New York Times&lt;/a&gt;.&lt;/p&gt;
</code></pre>

###图片

图片的语法和链接很像。

行内形式（title 是选择性的）：

<pre><code>
![alt text](/path/to/img.jpg "Title")
</code></pre>

参考形式：

<pre><code>
![alt text][id]

[id]: /path/to/img.jpg "Title"
</code></pre>

上面两种方法都会输出 HTML 为：

<pre><code>
&lt;img src=&quot;/path/to/img.jpg&quot; alt=&quot;alt text&quot; title=&quot;Title&quot; /&gt;
</code></pre>

###代码

在一般的段落文字中，你可以使用反引号 ` 来标记代码区段，区段内的 &、< 和 > 都会被自动的转换成 HTML 实体，这项特性让你可以很容易的在代码区段内插入 HTML 码：

<pre><code>
I strongly recommend against using any `&lt;blink&gt;` tags.

I wish SmartyPants used named entities like `&amp;mdash;`
instead of decimal-encoded entites like `&amp;#8212;`.
</code></pre>

####处理结果

<pre><code>
&lt;p&gt;I strongly recommend against using any
&lt;code&gt;&amp;lt;blink&amp;gt;&lt;/code&gt; tags.&lt;/p&gt;
&lt;p&gt;I wish SmartyPants used named entities like
&lt;code&gt;&amp;amp;mdash;&lt;/code&gt; instead of decimal-encoded
entites like &lt;code&gt;&amp;amp;#8212;&lt;/code&gt;.&lt;/p&gt;
</code></pre>

如果要建立一个已经格式化好的代码区块，只要每行都缩进 4 个空格或是一个 tab 就可以了，而 &、< 和 > 也一样会自动转成 HTML 实体。

####Markdown 语法:

<pre><code>
If you want your page to validate under XHTML 1.0 Strict,
you've got to put paragraph tags in your blockquotes:

&lt;blockquote&gt;
&lt;p&gt;For example.&lt;/p&gt;
&lt;/blockquote&gt;
</code></pre>

