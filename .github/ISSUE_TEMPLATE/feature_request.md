name: Feature request
description: Suggest an idea or improvement
title: "[feature] <short description>"
labels: [enhancement]
body:
  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: What problem does this solve? What’s the proposal?
    validations:
      required: true
  - type: textarea
    id: scope
    attributes:
      label: Scope / acceptance criteria
      description: Define success and out-of-scope items
      placeholder: |
        - Must have:
        - Nice to have:
        - Out of scope:
    validations:
      required: false
  - type: textarea
    id: context
    attributes:
      label: Context / references
      description: Links to specs, designs, or prior art
    validations:
      required: false

