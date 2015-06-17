---
layout: default
---

#Trace

{% for article in site.articles %}
<article id="{% if article.id %}{{ article.id | downcase | replace:' ','-' }}{% else %}{{ article.title | downcase | replace:' ','-' }}{% endif %}" class="{% if forloop.first %}first{% endif %}">

    <a class="icon anchor" href="#{% if article.id %}{{ article.id | downcase | replace:' ','-' }}{% else %}{{ article.title | downcase | replace:' ','-' }}{% endif %}" data-tip="Direct link"></a>
    <h2>{{ article.title }}</h2>
    

    {{ article.content }}
</article>
{% endfor %}