# Description
This program simulates a calculator. Keys can be pressed by clicking the on-screen display or by using the keyboard (note: see 'unwanted behaviors' for some exceptions). The user's current calculation will be displayed in the Calculation display area. Previous calculations can be reloaded.

## Note to instructors
I will update the entire README when the code is in a more professional state. As of now, it reflects the beta-demo nature of this project.

The code is in an ugly state. I wish I had outlined more carefully. Time-permitting (hold your laughter), I intend to heavily refactor this code. Hopefully for functionality, but definitely for legibility. I will likely create an entirely new outline and do some combination of editing and rewriting the existing code to create something I am more pleased with.


## Unwanted behaviors - matters of knowledge
These are behaviors that I attempted to resolve and could not.

Input field
 - When clicked, the input field displays a dropdown with options of 3, 6, and 9.
 - The line of code which triggers the multiplication button reads the '*' as a universal selector. I could likely resolve this by only accepting the 'x' key, but that is a less-than-ideal workaround. I imagine there is some universal (rimshot) practice for this, since it would otherwise come up constantly, but I couldn't find it.
 - I could not get the backspace key to trigger the delete button. It worked when I used the keyup event instead of keypress, but this resulted in my number buttons displaying twice in the input field. I decided the missing backspace was less horrible.

 Calculation display
  - When an integer involves two or more digits and a decimal, there is a one-cell gap between the number and the decimal. I expect this is tied to some combination of grid behaviors and my disorganized code, but I wasted probably hours trying to resolve it and could not.


## Unwanted behaviors - matters of time
I believe I am equipped to solve these behaviors, but did not possess the time to resolve them. They will be priorities when refactoring this code in the future. This list is not nearly exhaustive.

The load button will show a previous calculation in the Calculation Display area, but the loaded calculation cannot currently be operated on. This may be a minor pain to fix, but it shouldn't be all that complicated.

Sometimes when clearing the entire calculation, the last-clicked operator will remain in the display area. This is surely just a missing line of code somewhere, but it wasn't a priority for me by the time I noticed it.

Akin to the above behavior, the delete button doesn't seem to clear decimals.