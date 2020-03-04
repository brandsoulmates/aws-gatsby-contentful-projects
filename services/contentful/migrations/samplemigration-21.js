module.exports = function(migration) {
  const navigation = migration
    .createContentType("navigation")
    .name("Navigation")
    .description("A navigation container")
    .displayField("title");
  navigation
    .createField("title")
    .name("Title")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  navigation
    .createField("placement")
    .name("Placement")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  navigation
    .createField("navItems")
    .name("Nav Items")
    .type("Array")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: "Link",

      validations: [
        {
          linkContentType: ["navigationItem"]
        }
      ],

      linkType: "Entry"
    });

  navigation.changeEditorInterface("title", "singleLine", {});
  navigation.changeEditorInterface("placement", "singleLine", {});

  navigation.changeEditorInterface("navItems", "entryLinksEditor", {
    bulkEditing: false
  });
};
