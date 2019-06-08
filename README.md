# Front-end TWIG Starter

*"Live In Your World, Code In Ours."*



## Installation Instructions

Install dependencies by running Node.js package manager.

       npm install

Launch *production build* Gulp task.

       gulp build
       
Launch *development build* Gulp task.

       gulp build-dev


## Gulp Tasks

### Starting Dev Mode

To start *watch mode* and *local server*, execute `gulp watch` task.

    gulp watch


### Creating Parts

To create a new part, execute `gulp cf` task and pass `-main`, `-component` or `-partial` with an argument.

    gulp cf -main main-name
    gulp cf -component component-name
    gulp cf -partial partial-name

This command will create new module files in appropriate directory `src/twig/main`, `src/twig/components` or `src/twig/partial`:
* .twig
* .json
* .scss

It will also update appropriate scss file `main.scss`, `components.scss` or `partials.scss` in `src/sass/layout` directory.


### Creating a Page

To create a new template, execute `gulp cf` task and pass `-page` with argument.

    gulp cf -page some-page

This command will create new template files in `src/twig/pages` directory:
* .twig
* .json


### Generate Font Icons

To generate font icons, execute `gulp fonticons` task.

    gulp fonticons

This command will generate fonts:
 * .woff
 * .woff2
 * .ttf

 in `dist/icons` directory based on svg files from `src/assets/svg` directory.

 It will also update `_icon-font.scss` file in `src/scss/base` directory.

See this file for css classes you can use to display font icons.

In order to show icons, all you need to do is add class `"icon font-ico-heart"`

    <span class="icon font-ico-heart"></span>


### Building Files

To create development version files, execute `gulp build-dev` task.

    gulp build-dev

To create production version files, execute `gulp build` task.

    gulp build

*please note that build tasks will NOT generate font icons*

## Using Files

### TWIG
#### Modules
All sections, modules, blocks, ... *(header, footer, banner...)* should be created as parts in `src/twig/main`, `src/twig/components` or `src/twig/partial` directory.

Each module has three files:
* .twig *(html templating structure)*
* .json *(module content)*
* .scss *(module styles)*

**Example:**

*.twig file:*
```
<div class="team-list">
    <div class="wrap">
        <h2>{{ title }}</h2>

        {% if people %}
            <ul>
                {% for p in people %}
                    <li>{{ p.name }} {{ p.surname }}</li>
                {% endfor %}
            </ul>
        {% endif %}
    </div>
</div><!-- .team-list -->
```

*.json file:*
```
{
  "title": "Team List",
  "people": [
    {
      "name": "Emiko",
      "surname": "Groce"
    },
    {
      "name": "Leonila",
      "surname": "Gillins"
    }
  ]
}
```

*This will compile into:*
```
<div class="team-list">
    <h2>Team List</h2>

    <ul>
        <li>Emiko Groce</li>
        <li>Leonila Gillins</li>
    </ul>
</div>
<!-- .team-list -->
```

See [Twig](https://twig.symfony.com/doc/2.x/) templating engine for more information about `.twig` files.

#### Pages

Ideally all Pages should be created using *Components and Parts*.

Each template has two files:
* .twig *(html templating structure)*
* .json *(page content)*

**Example:**

*.twig file:*
```
{% extends "../main/base.twig" %}

{% block content %}
	{% include '../components/team-list/team-list.twig' with teamList only %}
{% endblock %}
```
*All page content **MUST** include an `extends` tag with `"../main/base.twig"` parameter at the top of the file.*

*It also **MUST** wrap all content in `{% block content %}`.*

*.json file:*
```
{
  "header": {
    ">>": "main/header/header.json"
  },
  "footer": {
    ">>": "main/footer/footer.json"
  },
  "teamList": {
    "title": "Team List",
    "people": [
      {
        "name": "Emiko",
        "surname": "Groce"
      },
      {
        "name": "Leonila",
        "surname": "Gillins"
      }
    ]
  }
}
```

Use json object to:
  - **include** module's `json` file:
    ```
    "header": {
        ">>": "header/header.json"
    }
    ```
  - or **input** different data:
    ```
    "teamList": {
        "title": "Team List",
        "people": [
          {
            "name": "Emiko",
            "surname": "Groce"
          }
        ]
      }
    ```

  - or **include** modules's `json` file and override **only** data you need:
    ```
    "teamList": {
        ">>": "components/team-list/team-list.json"
        "title": "This is changed Title"
    }
    ```

*This will compile into an `.html` file in `dist` directory.

### SCSS
All components and parts styles should be written in corresponding directory.

All global styles should be written in `src/sass` directories.

CSS code quality is checked with [Sass Lint](https://github.com/sasstools/sass-lint)
