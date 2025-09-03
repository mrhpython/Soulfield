name: Bug report
description: Report a problem to help us improve
title: "[bug] <short description>"
labels: [bug]
body:
  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: What happened? What did you expect?
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
      description: Provide minimal steps to reproduce
      placeholder: |
        1. Go to ...
        2. Run ...
        3. See error ...
    validations:
      required: true
  - type: textarea
    id: logs
    attributes:
      label: Logs / screenshots
      description: Include relevant logs or screenshots
    validations:
      required: false
  - type: input
    id: version
    attributes:
      label: Version / commit
      description: App version or git commit SHA
    validations:
      required: false

