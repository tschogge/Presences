# Metadata

The `metadata.json` file is a crucial component of every PreMiD Activity. It contains essential information about your activity, including its name, description, author, and various configuration options.

![Metadata in PreMiD Store](https://placehold.co/800x400?text=Metadata+in+PreMiD+Store)

## Basic Structure

Here's the basic structure of a `metadata.json` file:

```json
{
  "author": {
    "name": "Your Name",
    "id": "your_discord_id"
  },
  "service": "Example",
  "description": {
    "en": "Example is a website that does something cool."
  },
  "url": "example.com",
  "version": "1.0.0",
  "logo": "https://example.com/logo.png",
  "thumbnail": "https://example.com/thumbnail.png",
  "color": "#FF0000",
  "category": "other",
  "tags": ["example", "tag"]
}
```

## Required Fields

| Field         | Type            | Description                                                                                        |
| ------------- | --------------- | -------------------------------------------------------------------------------------------------- |
| `author`      | Object          | Information about the activity developer                                                           |
| `service`     | String          | The title of the service that this activity supports                                               |
| `description` | Object          | Small description of the service in different languages                                            |
| `url`         | String or Array | URL of the service (without http:// or https://)                                                   |
| `version`     | String          | Version of your activity (Semantic Versioning)                                                     |
| `logo`        | String          | Link to service's logo. For PreMiD-related activities, you can use `https://cdn.rcd.gg/PreMiD.png` |
| `thumbnail`   | String          | Link to service's thumbnail                                                                        |
| `color`       | String          | `#HEX` value for the activity color                                                                |
| `tags`        | Array           | Array with tags to help users find the activity                                                    |
| `category`    | String          | Category the activity falls under                                                                  |

## Optional Fields

| Field               | Type    | Description                                                                         |
| ------------------- | ------- | ----------------------------------------------------------------------------------- |
| `apiVersion`        | Number  | The API version to use (1 or 2). If not specified, defaults to 1                    |
| `contributors`      | Array   | Array of contributors to the activity                                               |
| `altnames`          | Array   | Alternative titles for the service                                                  |
| `iframe`            | Boolean | Defines whether `iFrames` are used                                                  |
| `regExp`            | String  | Regular expression string used to match URLs                                        |
| `iFrameRegExp`      | String  | Regular expression selector for iframes to inject into                              |
| `readLogs`          | Boolean | Defines whether `getLogs()` is used                                                 |
| `button`            | Boolean | Whether to include a "add activity" button on the store (partnered activities only) |
| `warning`           | Boolean | Whether to display a warning on the activity installation page                      |
| `settings`          | Array   | Array of settings the user can change                                               |
| `allowURLOverrides` | Boolean | Whether to allow users to override the URL of the activity                          |

## Detailed Field Explanations

### Author and Contributors

The `author` field is required and contains information about the activity developer:

```json
{
  "author": {
    "name": "Your Name",
    "id": "your_discord_id"
  }
}
```

The `contributors` field is optional and contains an array of contributors to the activity:

```json
{
  "contributors": [
    {
      "name": "Contributor Name",
      "id": "contributor_discord_id"
    }
  ]
}
```

### Description

The `description` field contains a small description of the service in different languages. The keys are language codes, and the values are the descriptions in those languages:

```json
{
  "description": {
    "de": "Example ist eine Website, die etwas Cooles macht.",
    "en": "Example is a website that does something cool.",
    "fr": "Example est un site web qui fait quelque chose de cool."
  }
}
```

You should at least provide an English description. The PreMiD translation team will help with other languages.

### URL

The `url` field contains the URL of the service. It can be a string or an array of strings:

```json
{
  "url": "example.com"
}
```

or

```json
{
  "url": ["example.com", "example.org"]
}
```

**Note**: Do not include `http://` or `https://` in the URL.

### Logo and Thumbnail

The `logo` and `thumbnail` fields contain links to the service's logo and thumbnail images:

<!-- eslint-skip -->

```json
{
  "logo": "https://example.com/logo.png",
  "thumbnail": "https://example.com/thumbnail.png"
}
```

**Logo**: A square image that represents the service. This will be displayed in the Discord Activity small image and in the PreMiD store.

**Thumbnail**: A wider image (16:9 recommended) that showcases the service. This will be displayed in the PreMiD store.

**For PreMiD-related activities**: You can use the official PreMiD logo by using this URL:

```json
{
  "logo": "https://cdn.rcd.gg/PreMiD.png"
}
```

### Category

The `category` field defines the category the activity falls under. It must be one of the following values:

- `anime`: Anime, manga, or Japanese content related websites
- `games`: Game related websites
- `music`: Music streaming or music related websites
- `socials`: Social media or community websites
- `videos`: Video streaming or video related websites
- `other`: Anything that doesn't fit in the above categories

```json
{
  "category": "videos"
}
```

### Settings

The `settings` field is an array of settings that users can customize. Each setting has the following properties:

| Property        | Type                  | Description                                 |
| --------------- | --------------------- | ------------------------------------------- |
| `id`            | String                | Identifier of the setting                   |
| `title`         | String                | Title of the setting                        |
| `icon`          | String                | Icon for the setting (Font Awesome class)   |
| `value`         | Boolean/String/Number | Default value of the setting                |
| `values`        | Array                 | Array of values for dropdown settings       |
| `placeholder`   | String                | Placeholder text for string settings        |
| `if`            | Object                | Conditions for the setting to appear        |
| `multiLanguage` | Boolean               | Use strings from localization files         |
| `description`   | String                | Description of the setting (schema v1.0.9+) |

#### Boolean Setting Example

```json
{
  "id": "showButtons",
  "title": "Show Buttons",
  "icon": "fas fa-compress-arrows-alt",
  "value": true,
  "description": "Display buttons in the Discord Activity"
}
```

#### Dropdown Setting Example

```json
{
  "id": "displayFormat",
  "title": "Display Format",
  "icon": "fas fa-paragraph",
  "value": 0,
  "values": ["Title", "Title - Artist", "Artist - Title"],
  "description": "Choose how to display the title and artist information"
}
```

#### Conditional Setting Example

```json
{
  "id": "showTimestamp",
  "title": "Show Timestamp",
  "icon": "fas fa-clock",
  "value": true,
  "description": "Show elapsed time since the activity started",
  "if": {
    "showButtons": true
  }
}
```

#### Multilanguage Setting Example

```json
{
  "id": "showButtons",
  "multiLanguage": true
}
```

### Description Property (v1.0.9+)

Starting with metadata schema version 1.0.9, every setting supports an optional `description` property that provides additional context about the setting. The description will be displayed in the extension starting from version 2.8.0 and upwards. While descriptions are not required, they are highly encouraged. Some settings where the title already provides enough context may not require this property.

Currently, settings only support string descriptions. Multi-language descriptions for settings will be added later.

**String Description Example:**

```json
{
  "id": "showButtons",
  "title": "Show Buttons",
  "icon": "fas fa-compress-arrows-alt",
  "value": true,
  "description": "Display buttons in the Discord Activity"
}
```

**Version Compatibility:**

- Metadata schema v1.0.9+: Description property is supported
- Extension v2.8.0+: Description is displayed in the settings UI
- Earlier versions: Description property is ignored

**Best Practices for Descriptions:**

- Keep descriptions concise (under 100 characters recommended)
- Use clear, action-oriented language
- Explain what the setting does, not just what it is
- Consider what users need to know to make an informed choice
- Use consistent tone and terminology across all settings
- Test descriptions with users who are unfamiliar with the feature

**Examples:**

- ✅ Good: "Show elapsed time since the activity started"
- ✅ Good: "Display interactive buttons in Discord Activity"
- ❌ Poor: "Timestamp setting"
- ❌ Poor: "Buttons"

### Regular Expressions

The `regExp` field is a regular expression string used to match URLs:

```json
{
  "regExp": "([a-z0-9-]+[.])*example[.]com[/]"
}
```

The `iFrameRegExp` field is a regular expression selector for iframes to inject into:

```json
{
  "iFrameRegExp": "([a-z0-9-]+[.])*example[.]com[/]embed[/]"
}
```

## Allow URL Overrides

The `allowURLOverrides` field is a boolean that determines whether users can override the activity's target URL. When set to `true`, users can input a custom regular expression in the activity settings to match different URLs.

This is particularly useful for services that support self-hosting, allowing users to configure the activity to work with their own server instances.

```json
{
  "allowURLOverrides": true
}
```

## Complete Example

Here's a complete example of a `metadata.json` file with all possible fields:

```json
{
  "apiVersion": 1,
  "author": {
    "name": "John Doe",
    "id": "123456789012345678"
  },
  "contributors": [
    {
      "name": "Jane Smith",
      "id": "876543210987654321"
    }
  ],
  "service": "Example",
  "altnames": ["Ex", "Sample"],
  "description": {
    "de": "Example ist eine Website, die etwas Cooles macht.",
    "en": "Example is a website that does something cool."
  },
  "url": "example.com",
  "regExp": "([a-z0-9-]+[.])*example[.]com[/]",
  "version": "1.0.0",
  "logo": "https://example.com/logo.png",
  "thumbnail": "https://example.com/thumbnail.png",
  "color": "#FF0000",
  "category": "other",
  "tags": ["example", "sample", "demo"],
  "settings": [
    {
      "id": "showButtons",
      "title": "Show Buttons",
      "icon": "fas fa-compress-arrows-alt",
      "value": true,
      "description": "Display buttons in the Discord Activity"
    },
    {
      "id": "showTimestamp",
      "title": "Show Timestamp",
      "icon": "fas fa-clock",
      "value": true,
      "description": "Show elapsed time since the activity started",
      "if": {
        "showButtons": true
      }
    },
    {
      "id": "buttonType",
      "title": "Button Type",
      "icon": "fas fa-mouse-pointer",
      "value": 0,
      "values": ["View Page", "Visit Website", "Read More"],
      "description": "Choose the type of button to display"
    }
  ]
}
```

## Best Practices

1. **Be descriptive**: Provide clear and concise descriptions of your activity.
2. **Use appropriate tags**: Choose tags that accurately represent your activity to help users find it.
3. **Choose the right category**: Select the category that best fits your activity.
4. **Provide high-quality images**: Use high-resolution images for the logo and thumbnail.
5. **Follow semantic versioning**: Use the MAJOR.MINOR.PATCH format for versioning.
6. **Keep settings simple**: Only add settings that are useful for users.
7. **Test your regular expressions**: Make sure your regular expressions correctly match the URLs you want to support.
8. **Omit false values**: Boolean fields that are `false` (like `iframe`, `readLogs`, etc.) should be omitted from the metadata.json file rather than explicitly set to false.
9. **Follow the guidelines**: Make sure your metadata follows our [Guidelines](/v1/guide/guidelines#metadata-requirements) for service naming, tags, and other requirements.

## Next Steps

Now that you understand how to configure your activity's metadata, you can learn more about:

- [Presence Class](/v1/guide/presence-class): Learn about the Presence class and its methods.
- [Settings](/v1/guide/settings): Learn how to add customizable settings to your activity.
- [iFrames](/v1/guide/iframes): Learn how to gather information from iframes.
