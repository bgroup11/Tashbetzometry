// Each cell on the crossword grid is null or one of these
function CrosswordCell(letter) {
    this.char = letter; // the actual letter for the cell on the crossword
    // If a word hits this cell going in the "across" direction, this will be a CrosswordCellNode
    this.across = null;
    // If a word hits this cell going in the "down" direction, this will be a CrosswordCellNode
    this.down = null;
}

// You can tell if the Node is the start of a word (which is needed if you want to number the cells)
// and what word and clue it corresponds to (using the index)
function CrosswordCellNode(is_start_of_word, index) {
    this.is_start_of_word = is_start_of_word;
    this.index = index; // use to map this node to its word or clue
}

function WordElement(word, index) {
    this.word = word; // the actual word
    this.index = index; // use to map this node to its word or clue
}

function Crossword(keys_in, words_in, clues_in, data) {
    var GRID_ROWS = 15;
    var GRID_COLS = 15;
    // This is an index of the positions of the char in the crossword (so we know where we can potentially place words)
    // example {"a" : [{'row' : 10, 'col' : 5}, {'row' : 62, 'col' :17}], {'row' : 54, 'col' : 12}], "b" : [{'row' : 3, 'col' : 13}]} 
    // where the two item arrays are the row and column of where the letter occurs
    var char_index = {};

    // these words are the words that can't be placed on the crossword
    var bad_words;

    // returns the crossword grid that has the ratio closest to 1 or null if it can't build one
    this.getSquareGrid = function (max_tries) {
        var best_grid = null;
        var best_ratio = 0;
        for (var i = 0; i < max_tries; i++) {
            var a_grid = this.getGrid(1);
            if (a_grid == null) continue;
            var ratio = Math.min(a_grid.length, a_grid[0].length) * 1.0 / Math.max(a_grid.length, a_grid[0].length);
            if (ratio > best_ratio) {
                best_grid = a_grid;
                best_ratio = ratio;
            }
            if (best_ratio == 1) break;
        }//יצירת תשחץ מספר פעמים עד לקבלת התשחץ הטוב ביותר מבחינת כמות מילים
        var charToFull = "";
        var wordsToFull = [];
        if (best_grid == undefined) {
            return best_grid;
        }
        for (var i = 0; i < best_grid.length; i++) {

            for (var j = 0; j < best_grid[i].length; j++) {
                var count_nulls = 0;
                var pos = j;
                if (best_grid[i][j] != null) {
                    charToFull = best_grid[i][j].char;
                    for (var k = (j + 1); k < best_grid[i].length; k++) {
                        if (best_grid[i][k] == null) {
                            ++count_nulls;
                        }
                        else {
                            break;
                        }
                    }
                    if (count_nulls >= 3) {

                        for (var s = 1; s < data.length; s++) {
                            var goodWord = true;
                            for (var w in wordsToFull) {
                                if (data[s].Word == wordsToFull[w]) {
                                    goodWord = false
                                }
                            }
                            if (goodWord) {

                                if (data[s].Word.length <= 3) {
                                    if (data[s].Word.substring(0, 1) == charToFull) {
                                        var word = data[s].Word;
                                        var letter = "";
                                        var str = "";
                                        for (var w = 0; w < word.length; w++) {
                                            letter = word.charAt(w);
                                            if (letter == "ף") {
                                                str = word.replace("ף", "פ");
                                                word = str;
                                            }
                                            else if (letter == "ך") {
                                                str = word.replace("ך", "כ");
                                                word = str;
                                            }
                                            else if (letter == "ן") {
                                                str = word.replace("ן", "נ");
                                                word = str;
                                            }
                                            else if (letter == "ם") {
                                                str = word.replace("ם", "מ");
                                                word = str;
                                            }
                                            else if (letter == "ץ") {
                                                str = word.replace("ץ", "צ");
                                                word = str;
                                            }
                                        }
                                    
                                        grid = best_grid;
                                        placeWordAt(word, words_in.length, i, j, 'across');
                                        canPlaceWordAt(word, i, j, 'across');
                                        for (var l = 1; l < word.length; l++) {
                                            pos += 1;
                                            canPlaceCharAt(word.charAt(l, 1), i, pos);
                                        }
                                        //best_grid[i][pos - 1] = new CrosswordCell(charToFull, new CrosswordCellNode(true, pos), null);
                                        //for (var l = 1; l < data[s].Word.length; l++) {
                                        //    pos += 1;
                                        //    best_grid[i][pos] = new CrosswordCell(data[s].Word.charAt(l, 1), new CrosswordCellNode(false, pos), null);

                                        //}
                                        wordsToFull.push(data[s].Word);
                                        keys_in.push(data[s].Key);
                                        words_in.push(word);
                                        clues_in.push(data[s].Clue);
                                        break;
                                    }

                                }

                            }
                        }
                    }
                }
            }
        }
        for (var i = 0; i < best_grid.length; i++) {

            for (var j = 0; j < best_grid[i].length; j++) {
                var count_nulls = 0;
                var pos = j;
                if (best_grid[i][j] != null) {
                    charToFull = best_grid[i][j].char;
                    for (var k = (i + 1); k < best_grid.length; k++) {
                        if (best_grid[k][j] == null) {
                            ++count_nulls;
                        }
                        else {
                            break;
                        }
                    }
                    if (count_nulls >= 3) {

                        for (var s = 1; s < data.length; s++) {
                            var goodWord = true;
                            for (var w in wordsToFull) {
                                if (data[s].Word == wordsToFull[w]) {
                                    goodWord = false

                                }
                            }
                            if (goodWord) {

                                if (data[s].Word.length <= 3) {
                                    if (data[s].Word.substring(0, 1) == charToFull) {
                                        var word = data[s].Word;
                                        var lette = "";
                                        var str = "";
                                        for (var w = 0; w < word.length; w++) {
                                            letter = word.charAt(w);
                                            if (letter == "ף") {
                                                str = word.replace("ף", "פ");
                                                word = str;
                                            }
                                            else if (letter == "ך") {
                                                str = word.replace("ך", "כ");
                                                word = str;
                                            }
                                            else if (letter == "ן") {
                                                str = word.replace("ן", "נ");
                                                word = str;
                                            }
                                            else if (letter == "ם") {
                                                str = word.replace("ם", "מ");
                                                word = str;
                                            }
                                            else if (letter == "ץ") {
                                                str = word.replace("ץ", "צ");
                                                word = str;
                                            }

                                        }
                                        grid = best_grid;
                                        placeWordAt(word, words_in.length, i, j, 'down');
                                        canPlaceWordAt(word, i, j, 'down');
                                        for (var l = 1; l < word.length; l++) {
                                            pos += 1;
                                            canPlaceCharAt(word.charAt(l, 1), i, pos);
                                        }

                                        //best_grid[i][pos - 1] = new CrosswordCell(charToFull, new CrosswordCellNode(true, pos), null);
                                        //for (var l = 1; l < data[s].Word.length; l++) {
                                        //    pos += 1;
                                        //    best_grid[i][pos] = new CrosswordCell(data[s].Word.charAt(l, 1), new CrosswordCellNode(false, pos), null);

                                        //}
                                        wordsToFull.push(data[s].Word);
                                        keys_in.push(data[s].Key);
                                        words_in.push(word);
                                        clues_in.push(data[s].Clue);
                                        break;
                                    }

                                }
                            }
                        }
                    }
                }
            }
        }
        console.log("moreWords:", wordsToFull);
        return best_grid;
    }

    // returns an abitrary grid, or null if it can't build one
    this.getGrid = function (max_tries) {
        for (var tries = 0; tries < max_tries; tries++) {
            clear(); // always start with a fresh grid and char_index
            // place the first word in the middle of the grid
            var start_dir = randomDirection();
            var r = Math.floor(grid.length / 2);
            var c = Math.floor(grid[0].length / 2);
            var word_element = word_elements[0];
            if (start_dir == "across") {
                c -= Math.floor(word_element.word.length / 2);
            } else {
                r -= Math.floor(word_element.word.length / 2);
            }

            if (canPlaceWordAt(word_element.word, r, c, start_dir) !== false) {
                placeWordAt(word_element.word, word_element.index, r, c, start_dir);
            } else {
                bad_words = [word_element];
                return null;
            }

            // start with a group containing all the words (except the first)
            // as we go, we try to place each word in the group onto the grid
            // if the word can't go on the grid, we add that word to the next group 
            var groups = [];
            groups.push(word_elements.slice(1));
            for (var g = 0; g < groups.length; g++) {
                word_has_been_added_to_grid = false;
                // try to add all the words in this group to the grid
                for (var i = 0; i < groups[g].length; i++) {
                    var word_element = groups[g][i];
                    var best_position = findPositionForWord(word_element.word);
                    if (!best_position) {
                        // make the new group (if needed)
                        if (groups.length - 1 == g) groups.push([]);
                        // place the word in the next group
                        groups[g + 1].push(word_element);
                    } else {
                        var r = best_position["row"], c = best_position["col"], dir = best_position['direction'];
                        placeWordAt(word_element.word, word_element.index, r, c, dir);
                        word_has_been_added_to_grid = true;
                    }
                }
                // if we haven't made any progress, there is no point in going on to the next group
                if (!word_has_been_added_to_grid) break;
            }
            // no need to try again
            if (word_has_been_added_to_grid) return minimizeGrid();

        }

        bad_words = groups[groups.length - 1];
        return null;
    }

    // returns the list of WordElements that can't fit on the crossword
    this.getBadWords = function () {
        return bad_words;
    }

    // get two arrays ("across" and "down") that contain objects describing the
    // topological position of the word (e.g. 1 is the first word starting from
    // the top left, going to the bottom right), the index of the word (in the
    // original input list), the clue, and the word itself
    this.getLegend = function (grid) {
        var groups = { "across": [], "down": [] };
        var position = 1;
        for (var r = 0; r < grid.length; r++) {
            for (var c = 0; c < grid[r].length; c++) {
                var cell = grid[r][c];
                var increment_position = false;
                // check across and down
                for (var k in groups) {
                    // does a word start here? (make sure the cell isn't null, first)
                    if (cell && cell[k] && cell[k]['is_start_of_word']) {
                        var index = cell[k]['index'];
                        groups[k].push({ "position": position, "x": c, "y": r, "index": index, "clue": clues_in[index], "word": words_in[index] });
                        increment_position = true;
                    }
                }

                if (increment_position) position++;
            }
        }
        return groups;
    }//יצירת 2 מערכים שמאלה ולמטה והכנסת המילים+רמזים לכל מערך

    // move the grid into the smallest grid that will fit it
    var minimizeGrid = function () {
        // find bounds
        var r_min = GRID_ROWS - 1, r_max = 0, c_min = GRID_COLS - 1, c_max = 0;
        for (var r = 0; r < GRID_ROWS; r++) {
            for (var c = 0; c < GRID_COLS; c++) {
                var cell = grid[r][c];
                if (cell != null) {
                    if (r < r_min) r_min = r;
                    if (r > r_max) r_max = r;
                    if (c < c_min) c_min = c;
                    if (c > c_max) c_max = c;
                }
            }
        }
        // initialize new grid
        var rows = r_max - r_min + 1;
        var cols = c_max - c_min + 1;
        var new_grid = new Array(rows);
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                new_grid[r] = new Array(cols);
            }
        }

        // copy the grid into the smaller grid
        for (var r = r_min, r2 = 0; r2 < rows; r++ , r2++) {
            for (var c = c_min, c2 = 0; c2 < cols; c++ , c2++) {
                new_grid[r2][c2] = grid[r][c];
            }
        }

        return new_grid;
    }

    // helper for placeWordAt();
    var addCellToGrid = function (word, index_of_word_in_input_list, index_of_char, r, c, direction) {
        var char = word.charAt(index_of_char);
        if (grid[r][c] == null) {
            grid[r][c] = new CrosswordCell(char);

            // init the char_index for that character if needed
            if (!char_index[char]) char_index[char] = [];

            // add to index
            char_index[char].push({ "row": r, "col": c });
        }

        var is_start_of_word = index_of_char == 0;
        grid[r][c][direction] = new CrosswordCellNode(is_start_of_word, index_of_word_in_input_list);

    }

    // place the word at the row and col indicated (the first char goes there)
    // the next chars go to the right (across) or below (down), depending on the direction
    var placeWordAt = function (word, index_of_word_in_input_list, row, col, direction) {
        if (direction == "across") {
            for (var c = col, i = 0; c < col + word.length; c++ , i++) {
                addCellToGrid(word, index_of_word_in_input_list, i, row, c, direction);
            }
        } else if (direction == "down") {
            for (var r = row, i = 0; r < row + word.length; r++ , i++) {
                addCellToGrid(word, index_of_word_in_input_list, i, r, col, direction);
            }
        } else {
            throw "Invalid Direction";
        }
    }

    // you can only place a char where the space is blank, or when the same
    // character exists there already
    // returns false, if you can't place the char
    // 0 if you can place the char, but there is no intersection
    // 1 if you can place the char, and there is an intersection
    var canPlaceCharAt = function (char, row, col) {
        // no intersection
        if (grid[row][col] == null) return 0;
        // intersection!
        if (grid[row][col]['char'] == char) return 1;

        return false;
    }

    // determines if you can place a word at the row, column in the direction
    var canPlaceWordAt = function (word, row, col, direction) {
        // out of bounds
        if (row < 0 || row >= grid.length || col < 0 || col >= grid[row].length) return false;

        if (direction == "across") {
            // out of bounds (word too long)
            if (col + word.length > grid[row].length) return false;
            // can't have a word directly to the left
            if (col - 1 >= 0 && grid[row][col - 1] != null) return false;
            // can't have word directly to the right
            if (col + word.length < grid[row].length && grid[row][col + word.length] != null) return false;

            // check the row above to make sure there isn't another word
            // running parallel. It is ok if there is a character above, only if
            // the character below it intersects with the current word
            for (var r = row - 1, c = col, i = 0; r >= 0 && c < col + word.length; c++ , i++) {
                var is_empty = grid[r][c] == null;
                var is_intersection = grid[row][c] != null && grid[row][c]['char'] == word.charAt(i);
                var can_place_here = is_empty || is_intersection;
                if (!can_place_here) return false;
            }

            // same deal as above, we just search in the row below the word
            for (var r = row + 1, c = col, i = 0; r < grid.length && c < col + word.length; c++ , i++) {
                var is_empty = grid[r][c] == null;
                var is_intersection = grid[row][c] != null && grid[row][c]['char'] == word.charAt(i);
                var can_place_here = is_empty || is_intersection;
                if (!can_place_here) return false;
            }

            // check to make sure we aren't overlapping a char (that doesn't match)
            // and get the count of intersections
            var intersections = 0;
            for (var c = col, i = 0; c < col + word.length; c++ , i++) {
                var result = canPlaceCharAt(word.charAt(i), row, c);
                if (result === false) return false;
                intersections += result;
            }
        } else if (direction == "down") {
            // out of bounds
            if (row + word.length > grid.length) return false;
            // can't have a word directly above
            if (row - 1 >= 0 && grid[row - 1][col] != null) return false;
            // can't have a word directly below
            if (row + word.length < grid.length && grid[row + word.length][col] != null) return false;

            // check the column to the left to make sure there isn't another
            // word running parallel. It is ok if there is a character to the
            // left, only if the character to the right intersects with the
            // current word
            for (var c = col - 1, r = row, i = 0; c >= 0 && r < row + word.length; r++ , i++) {
                var is_empty = grid[r][c] == null;
                var is_intersection = grid[r][col] != null && grid[r][col]['char'] == word.charAt(i);
                var can_place_here = is_empty || is_intersection;
                if (!can_place_here) return false;
            }

            // same deal, but look at the column to the right
            for (var c = col + 1, r = row, i = 0; r < row + word.length && c < grid[r].length; r++ , i++) {
                var is_empty = grid[r][c] == null;
                var is_intersection = grid[r][col] != null && grid[r][col]['char'] == word.charAt(i);
                var can_place_here = is_empty || is_intersection;
                if (!can_place_here) return false;
            }

            // check to make sure we aren't overlapping a char (that doesn't match)
            // and get the count of intersections
            var intersections = 0;
            for (var r = row, i = 0; r < row + word.length; r++ , i++) {
                var result = canPlaceCharAt(word.charAt(i, 1), r, col);
                if (result === false) return false;
                intersections += result;
            }
        } else {
            throw "Invalid Direction";
        }
        return intersections;
    }

    var randomDirection = function () {
        return Math.floor(Math.random() * 2) ? "across" : "down";
    }

    var findPositionForWord = function (word) {
        // check the char_index for every letter, and see if we can put it there in a direction
        var bests = [];
        for (var i = 0; i < word.length; i++) {
            var possible_locations_on_grid = char_index[word.charAt(i)];
            if (!possible_locations_on_grid) continue;
            for (var j = 0; j < possible_locations_on_grid.length; j++) {
                var point = possible_locations_on_grid[j];
                var r = point['row'];
                var c = point['col'];
                // the c - i, and r - i here compensate for the offset of character in the word
                var intersections_across = canPlaceWordAt(word, r, c - i, "across");
                var intersections_down = canPlaceWordAt(word, r - i, c, "down");

                if (intersections_across !== false)
                    bests.push({ "intersections": intersections_across, "row": r, "col": c - i, "direction": "across" });
                if (intersections_down !== false)
                    bests.push({ "intersections": intersections_down, "row": r - i, "col": c, "direction": "down" });
            }
        }

        if (bests.length == 0) return false;

        // find a good random position
        var best = bests[Math.floor(Math.random() * bests.length)];

        return best;
    }

    var clear = function () {
        for (var r = 0; r < grid.length; r++) {
            for (var c = 0; c < grid[r].length; c++) {
                grid[r][c] = null;
            }
        }
        char_index = {};
    }

    // constructor
    if (words_in.length < 2) throw "A crossword must have at least 2 words";
    if (words_in.length != clues_in.length) throw "The number of words must equal the number of clues";

    // build the grid;
    var grid = new Array(GRID_ROWS);
    for (var i = 0; i < GRID_ROWS; i++) {
        grid[i] = new Array(GRID_COLS);
    }

    // build the element list (need to keep track of indexes in the originial input arrays)
    var word_elements = [];
    for (var i = 0; i < words_in.length; i++) {
        word_elements.push(new WordElement(words_in[i], i));
    }


    word_elements.sort(function (a, b) { return b.word.length - a.word.length; });
}

var CrosswordUtils = {
    PATH_TO_PNGS_OF_NUMBERS: "../Crossword-Generator-master/numbers/",

    toHtml: function (grid, show_answers) {
        show_answers = false;
        if (grid == null) return;
        var html = [];
        html.push("<table class='crossword'>");
        var label = 1;
        for (var r = 0; r < grid.length; r++) {
            html.push("<tr>");
            for (var c = 0; c < grid[r].length; c++) {
                var cell = grid[r][c];
                var is_start_of_word = false;
                if (cell == null) {
                    var char = "&nbsp;";
                    var css_class = "no-border";
                } else {
                    var char = cell['char'];
                    var css_class = "tdclass";
                    var is_start_of_word = (cell['across'] && cell['across']['is_start_of_word']) || (cell['down'] && cell['down']['is_start_of_word']);
                }

                if (is_start_of_word) {
                    var img_url = CrosswordUtils.PATH_TO_PNGS_OF_NUMBERS + label + ".png";
                    html.push("<td id='" + c + "-" + r + "'class='" + css_class + "' title='" + r + ", " + c + "' style=\"background-image:url('" + img_url + "')\">");
                    label++;
                } else {
                    html.push("<td id='" + c + "-" + r + "' class='" + css_class + "' title='" + r + ", " + c + "'>");
                }

                if (show_answers) {
                    html.push(char);
                } else {
                    html.push("&nbsp;");
                }
            }
            html.push("</tr>");
        }
        html.push("</table>");
        return html.join("\n");
    }
}//יצירת משבצות התשבץ ושמירת הנתנונים (אות ומיקום) על כל משבצת 

function showCrossWordOptions() {
    /* solvefunction()

        User clicked the "solve" button for a phrase on the across or down list. Provide a prompt for solving the clue.

    */

    var solvefunction = function () {
        $('#solution-answer').val('');
        $('#answer-results').hide();
        $('#answer-results').html('');

        var word = $(this).attr('data-word');
        var acrosstext = $(this).attr('data-across') == 'false' ? 'Down' : 'Across';
        //if (acrosstext =='Down') {
        //    acrosstext = "מאונך";
        //}
        //else {
        //    acrosstext = "מאוזן";
        //}
        var str = "";
        for (var i = 0; i < word.length; i++) {
            str += " _ "
        }
        $('#position-and-clue').html('<b>' + acrosstext + '</b> : ' + $(this).attr('data-clue') + '<br/>' + str + '(' + word.length + ')');
        $('#answer-form').show();
        //ביטול חסימת הזנת תשובה נוספת והמשך המילה לאחר קבלת רמז
        //if ($(this).children('span').attr('data-solved')) {
        //    $('#answer-button').attr('disabled', true);
        //    $('#reveal-answer-button').attr('disabled', true);

        //    $('#answer-results').show();
        //    $('#answer-results').html('You have already solved this problem.');

        //    $('#solution-answer').val(word);
        //} else {
        $('#solution-answer').attr('maxlength', 50);
        $('#answer-button').attr('data-word', word);
        $('#reveal-answer-button').attr('data-word', word);

        var clue = $(this).attr('data-clue');
        $('#answer-button').attr('data-clue', clue);
        $('#reveal-answer-button').attr('data-clue', clue);

        var datax = $(this).attr('data-x');

        $('#answer-button').attr('data-x', datax);
        $('#reveal-answer-button').attr('data-x', datax);

        var datay = $(this).attr('data-y');

        $('#answer-button').attr('data-y', datay);
        $('#reveal-answer-button').attr('data-y', datay);

        var across = $(this).attr('data-across');

        $('#answer-button').attr('data-across', across);
        $('#reveal-answer-button').attr('data-across', across);

        $('#solution-answer').focus();

        $('#answer-button').attr('disabled', false);
        $('#reveal-answer-button').attr('disabled', false);
        //}

        return false;
    }

    /* closesolvefunction()

        User clicked "close" on the "solve phrase" dialogue that was brought up by solvefunction().

    */

    var closesolvefunction = function () {
        $('#answer-results').hide();
        $('#answer-form').hide();
        return false;
    }

    /* answerfunction()

        User clicked "answer" on the "solve phrase" dialogue that was brought up by solvefunction().

    */

    var answerfunction = function () {
        var word = $(this).attr('data-word');
        var answer = $('#solution-answer').val();
        var answer2 = answer.split(" ");
        var answernospace = "";
        for (var i = 0; i < answer2.length; i++) {

            answernospace += answer2[i];
        }
        var str = "";
        for (var j = 0; j < answernospace.length; j++) {
            if (answernospace[j] == "ף") {
                str = answernospace.replace("ף", "פ");
                answernospace = str;
            }
            else if (answernospace[j] == "ך") {
                str = answernospace.replace("ך", "כ");
                answernospace = str;
            }
            else if (answernospace[j] == "ן") {
                str = answernospace.replace("ן", "נ");
                answernospace = str;
            }
            else if (answernospace[j] == "ם") {
                str = answernospace.replace("ם", "מ");
                answernospace = str;
            }
            else if (answernospace[j] == "ץ") {
                str = answernospace.replace("ץ", "צ");
                answernospace = str;
            }
            else {
                str = answernospace;
            }
        }

        if (str == word) {
            var across = $(this).attr('data-across');

            var x = parseInt($(this).attr('data-x'), 10);
            var y = parseInt($(this).attr('data-y'), 10);

            if (across == 'across') {
                for (var i = 0; i < str.length; i++) {
                    var newwidth = x + i;
                    var letterposition = 'letter-position-' + newwidth + '-' + y;
                    $('#' + letterposition).text(str[i]);
                    var cell = grid[y][newwidth];
                    var char = cell['char'];
                    var position = ""
                    position = newwidth + "-" + y;
                    document.getElementById(position).innerHTML = char;
                    $("#" + newwidth + "-" + y).addClass('backtd');

                }
                $('#' + word + '-listing').attr('data-solved', true);
                $('#' + word + '-listing').addClass('strikeout');
                $('#answer-form').hide();

            } else {
                for (var i = 0; i < str.length; i++) {
                    var newheight = y + i;
                    var letterposition = 'letter-position-' + x + '-' + newheight;
                    $('#' + letterposition).text(str[i]);
                    var cell = grid[newheight][x];
                    var char = cell['char'];
                    var position = ""
                    position = x + "-" + newheight;
                    document.getElementById(position).innerHTML = char;
                    $("#" + x + "-" + newheight).addClass('backtd');
                }
                $('#' + word + '-listing').attr('data-solved', true);
                $('#' + word + '-listing').addClass('strikeout');
                $('#answer-form').hide();
            }



        } else {
            if (!$('#answer-results').is(':visible')) {
                $('#answer-results').show();
                $('#answer-results').html('Incorrect Answer, Please Try Again');
            }
        }

        return false;
    }

    /* revealanswerfunction()

        User clicked "reveal answer" on the "solve phrase" dialogue that was brought up by solvefunction().

    */
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //הכנסת רמז לטבלת רמזים שנלקחו
    function PostHint(um, w, c) {
        var hint = {
            UserMail: um,
            Word: w,
            Clue: c
        };
        ajaxCall("POST", "../api/Hints", JSON.stringify(hint), PostHintSuccessCB, PostHintErrorCB)
    }
    function PostHintSuccessCB(data) {
        console.log("PostHint Succsses!", data);
    }
    function PostHintErrorCB(err) {
        console.log("Error PostUser:", err);
    }

    var revealanswerfunction = function () {
        var usermail = "nitzan@gmail.com";
        var word = $(this).attr('data-word');
        var across = $(this).attr('data-across');
        var clue = $(this).attr('data-clue');
        var x = parseInt($(this).attr('data-x'), 10);
        var y = parseInt($(this).attr('data-y'), 10);
        var num = getRndInteger(0, word.length);
        if (across == 'across') {

            var newwidth = x + num;
            var letterposition = 'letter-position-' + newwidth + '-' + y;
            $('#' + letterposition).text(word[num]);
            var cell = grid[y][newwidth];
            var char = cell['char'];
            var position = ""
            position = newwidth + "-" + y;
            document.getElementById(position).innerHTML = char;
            $("#" + newwidth + "-" + y).addClass('backtd');
        } else {

            var newheigt = y + num;
            var letterposition = 'letter-position-' + x + '-' + newheigt;
            $('#' + letterposition).text(word[num]);
            var cell = grid[newheigt][x];
            var char = cell['char'];
            var position = ""
            position = x + "-" + newheigt;
            document.getElementById(position).innerHTML = char;
            $("#" + x + "-" + newheigt).addClass('backtd');
         }

        //$('#' + word + '-listing').addClass('red-strikeout');
        $('#' + word + '-listing').attr('data-solved', true);

        $('#answer-form').hide();

        //הכנסת הרמז לטבלת Hints
        PostHint(usermail, word, clue);
    }

    $('.word-clue').click(solvefunction);
    $('#cancel-button').click(closesolvefunction);
    $('#answer-button').click(answerfunction);
    $('#reveal-answer-button').click(revealanswerfunction);
}

