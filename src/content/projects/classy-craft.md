---
title: Classy Craft
summary: A Java desktop editor for UML class diagrams and mind maps, built around MVC and classic design patterns.
layer: interface
stack: [Java, Maven, MVC]
team: Team of 2
context: Software Design course, RAF
repo: https://github.com/vidanstojic/Classy-Craft---Dizajn-softvera
order: 50
---

## Problem and goal

A desktop editor for UML class diagrams and mind maps, where the main requirement was applying design patterns properly rather than just making it work.

## Architecture and technical decisions

- **MVC** separates the diagram model from its views and controllers.
- **Command** for undo and redo, **State** for selecting, drawing and moving, **Composite** for nested elements, **Observer** to keep views in sync, **Factory Method** for diagram elements and **Singleton** for application state.

## Challenges and how they were solved

- **Undo and redo for every action.** Each edit is a command object that knows how to reverse itself.
- **Many interaction modes on one canvas.** Each mode is a state object, so adding a tool doesn't touch the others.
- **Saving work.** Diagrams import and export as UML files or images, and several diagrams can be grouped into one project.
