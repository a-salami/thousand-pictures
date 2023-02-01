//dynamically finds the relative path for any internal link back to the root folder 'site'
function dynamicRelativeReference(){
    rootFolder = ""; //holds relative file path for any href
    numSlashes = 0; //counts the number of [../] necessary to get to 'site'

    var filename = location.pathname.split("thousand-pictures")[1]; //gets the full file path, splits it, keeps the split only after the word 'site'

    //determine number of [/] present in the root folder filepath
    for (a in filename){ //step through each character in filename
        if (filename[a] == "/"){ 
            numSlashes += 1; //count every instance of "/"
        }
    }

    // decrement 1 [/]: excludes the [/] that comes right before the filename. That's an "internal" [/]
    numSlashes -= 1;

    //creates a relative pathing string of [../]
    for (b = 0; b < numSlashes; b++){
        rootFolder += "../";
    }
    return rootFolder;
}

//creates the header for all pages
function setHeader(id){
    content = `<a href = "` + dynamicRelativeReference() + `index.html">
    <h1 id = "pageTitle">In the Eye of a Thousand Pictures</h1>
    <h5 id = "pageSubtitle" class = "subheader"><i>An elaborate display of video games and their music, genres, and art</i></h5></a>`;

    document.getElementById(id).innerHTML += content;
}

//creates the navigation bar for all pages
function setNavbar(id){
    content = `<ul>
        <li class = "two"><a href = "` + dynamicRelativeReference() + `index.html">Home</a></li>
        <li class = "one"><a href = "` + dynamicRelativeReference() + `pages/genres.html">Genres</a></li>
        <li class = "two"><a href = "` + dynamicRelativeReference() + `pages/recommend-for-you.html">Recs for You</a></li>
        <li class = "one"><a href = "` + dynamicRelativeReference() + `pages/recommend-for-me.html">Recs for Me?</a></li>
        <li class = "two"><a href = "` + dynamicRelativeReference() + `pages/gallery.html">Gallery</a></li>
        <li class = "one"><a href = "` + dynamicRelativeReference() + `pages/vgm.html">VGM</a></li>
        <li class = "two"><a href = "` + dynamicRelativeReference() + `pages/reference.html">References</a></li>
    </ul>`;

    document.getElementById(id).innerHTML += content;
}

//customizes a greeting for the page user; called exclusively to edit setFooter()
function customizedGreeting(){
    var greeting = document.getElementById("userGreeting").value; //gets the current value of the userGreeting element in the footer
    localStorage.setItem("greeting", greeting); //assigns to local storage to ensure data retention

    if (greeting == ""){ //if the user (re)submitted a blank text field
        localStorage.setItem("greeting", "friend"); //set to 'friend'
    }

    document.getElementById("greeting").innerHTML = "Welcome, " + localStorage.getItem("greeting") + "."; //post the user's personalized/reset greeting
}

//resets the greeting for the page user; called exclusively to edit setFooter()
function resetGreeting(){
    localStorage.setItem("greeting", "friend"); //reset to 'friend'
    document.getElementById("greeting").innerHTML = "Welcome, " + localStorage.getItem("greeting") + "."; //set the userGreeting element accordingly
}

//creates the footer for all pages
function setFooter(id){
    lastModified = document.lastModified.slice(0, -3); //cutting off the seconds in the time output format hh:mm:ss

    //replacing 24hr time display with typical 12hr time display
    if(parseInt(lastModified.slice(11, 13)) > 12){ //if the hour is greater than 12
        hour = parseInt(lastModified.slice(11, 13)) - 12; //subtract 12 from it
        lastModified = lastModified.slice(0, 10) + " " + hour + ":" + lastModified.slice(14) + " p.m."; //add a p.m. to the end of the string
    }
    else{ 
        lastModified += " a.m."; //add an a.m. to the end of the string
    }

    content = `
    <div class = "col-sm-5 greeting">
        <h4 id = "greeting">Welcome, ` + localStorage.getItem("greeting") + `.</h4>
        <h5>Want to customize this greeting?</h5>

        <form onsubmit = "customizedGreeting(); this.reset();">
            <input class = "inputText" type = "text" id = "userGreeting" placeholder = "Enter your name here..."><br>
            <input type = "submit" value = "(Re)Submit Name">
        </form>
        <input type = "submit" value = "Reset Name to Default" onclick = "resetGreeting();">
    </div>

    <div class = "col-sm-7">
        <h4><a href = "#top">To top</a></h4>
        <h4>Page last modified: ` + lastModified + `</h4>
        <h4>View this site's CSS here: <a target = "_blank" href = "` + dynamicRelativeReference() + `cssJS/thousandPictures.css">thousandPictures.css</a></h4>
        <h5><i>Disclaimer: this website is being developed as an educational project.</i></h5>
    </div>`;

    document.getElementById(id).innerHTML += content;
}

//builds an html table
function setTable(id, subgenre, subgenres){
    content = ``; //establishes content as a blank holding variable for each function call
    numColumns = 2; //determines number of columns in the table
    numRows = Math.floor(subgenres.length / 2); //determines number of rows in the table, rounded down to nearest int

    if (subgenre == "Strategy Games"){ //temporary error fix for the 'strategy games' table
        numRows -= 1; //it counts an extra row (due to counting an extra item in the array) where one should not be
    }

    if (subgenres.length % 2 != 0){ //if there are an odd number of subgenres,
        numColumns = 3; //allow for three columns

        if (subgenres.length % 3 != 0){ //if there is a column in which there are not three items
            for (a = 0; a < subgenres.length % 3; a++){
                subgenres.push(["", ""]); //add an extra blank table space to fill out the missing space
            }
        }
    }
    
    content += `<table>
    <tr>
        <th colspan = ` + numColumns + `> ` + subgenre + `</th>
    </tr>`;

    counter = 0; //tracks the index of subgenre
    for (a = 0; a < numRows; a++){//for this row in the table
        content += `<tr>`;

        for (b = 0; b < numColumns; b++){//for each row item in this row
            content += `<td><a target = "_blank" href = "` + subgenres[counter][0] + `">` + subgenres[counter][1] + `</a></td>`; //link subgenre and add it to table
            // content +=  `<td>` + counter +  `</td>`; //uncomment this and comment line above for testing purposes
            counter += 1;
        }
        content += `</tr>`;
    }
    content += `</table>`;
    document.getElementById(id).innerHTML += content;
}

//generates a random index in images[] to display on upon page entry; for use exclusively in slideshow()
function rng(max){
    min = 0;
    display = Math.floor(Math.random() * (max - min)) + min; //choosing a random picture index from images[] to display upon page entry
    return display;
}

//sets the image to display a random image in the site's gallery; for use on its own or exclusively called in slideshow()
function displayImage(id, images, currentIndex){
    source = dynamicRelativeReference() + `images/` + images[currentIndex][0]; //dynamic relative path to image
    document.getElementById(id).src = source; //set image to appropriate html element

    //setting image alt text, game name, and caption (same as alt text)
    document.getElementById(id).alt = images[currentIndex][2];
    document.getElementById("game").innerHTML = images[currentIndex][1];
    document.getElementById("text").innerHTML = images[currentIndex][2];
}

//creates a moving gallery/slideshow on gallery.html with functioning next/back buttons
function slideshow(id, backNext = "none"){
    //game names as shorthand variables so I don't have to retype them 80 million times
    ac = "Animal Crossing: New Horizons";
    botw = "The Legend of Zelda: Breath of the Wild";
    dqb2 = "Dragon Quest Builders 2";
    mes = "The Messenger";
    om = "Opus Magnum";
    sh = "Sun Haven";
    sv = "Stardew Valley";
    t = "Terraria";
    tmo = "Terraria: Modded"
    tma = "Terraria: Master Mode";
      
    //indexes: image name, game name, image alt text (which also serves as the caption)
    images = [
        ["acAdventure.png", ac, "Minni's neighbors pretending to be on an adventure"],
        ["acBedroom.png", ac, "Minni falling asleep in her bedroom (not even in her bed!)"],
        ["acBirdSanctuary.png", ac, "Minni relaxing in her friend Gladys' backyard"],
        ["acBlackWhite.png", ac, "Minni, dressed as the flowers are, walking amongst them peacefully"],
        ["acBugCatching.png", ac, "Minni in the park, preparing to catch a butterfly"],
        ["acCarrotPatch.png", ac, "Minni, joyfully posing amongst the carrots"],
        ["acChickenDress.png", ac, "Minni standing in front of her home, with a dress referencing another world..."],
        ["acCooking.png", ac, "Minni making a favorite dish of hers"],
        ["acCourtyard.png", ac, "Minni happily relaxing in a pink, floral couryard"],
        ["acDinner.png", ac, "Minni having dinner in her cozy kitchen"],
        ["acKitchenCooking.png", ac, "Minni preparing to make a meal in her kitchen"],
        ["acKitchenJoy.png", ac, "Minni joyfully posing for a picture before eating her dinner"],
        ["acLivingRoom.png", ac, "Minni peacefully sitting in her living room"],
        ["acLoversLake.png", ac, "A quiet, contemplative thought down at Lover's Lake"],
        ["acMusicRoom.png", ac, "So many instruments in a music room, and only one person to play them!"],
        ["acParkClock.png", ac, "A park in the middle of Cloverfeld Island, awaiting a respectful visitor"],
        ["acPash.png", ac, "Minni on her way to visit her neighbor Pashmina"],
        ["acPiano.png", ac, "Minni standing in front of a mahogany piano in a performance dress"],
        ["acPotatoPicking.png", ac, "Hard at work in harvest season, Minni gathers potatoes"],
        ["acPrairie.png", ac, "Waving happily from outside her home, Minni shows off a new plaid dress she got from the market"],
        ["acPumpkin.png", ac, "A fall-themed outfit brings joy in a pumpkin patch"],
        ["acPumpkinPicking.png", ac, "Pumpkins ripe for the picking, Minni gets to work harvesting them"],
        ["acTownHall.png", ac, "On her way to town hall and dressed fabulously in a blue dress, Minni is out for a stroll in Cloverfeld"],

        //add botw pictures here

        ["dqb2Buildings.png", dqb2, "Much of the architectures in the Green Gardens"],
        ["dqb2Farms.png", dqb2, "A lush farmlands in the Green Gardens"],
        ["dqb2Hut.png", dqb2, "A small cafe at the foot of the other, larger buildings in Green Gardens"],
        ["dqb2Malroth.png", dqb2, "Osiris with her best friend, Malroth"],
        ["dqb2Osiris.png", dqb2, "Osiris relaxing on a beach chair in the Green Gardens"],
        ["dqb2WinterBeach.png", dqb2, "Osiris relaxing on a beach chair celebrating summer in winter"],

        ["messengerCloudstep.png", mes, "The Messenger in the middle of a cloudstep"],
        ["messengerOceanTemple.png", mes, "The Messenger exploring an ocean temple"],
        ["messengerRiviereTurquoise.png", mes, "The Messenger exploring the Riviere Turquoise"],
        ["messengerTempleTime.png", mes, "The Messenger in the heart of the Temple of Time"],

        ["omAlcSeperation.gif", om, "The automated solution for creating 'alcohol seperation'"],
        ["omWarmingTonic.gif", om, "The automated solution for creating a 'warming tonic'"],

        ["shFrontPorch.jpg", sh, "The front view of Osiris' Sun Haven farm"],
        ["shHome.jpg", sh, "The inside of Osiris' home"],
        ["shHoneyGarden.jpg", sh, "The flower garden where honey is made every two days"],
        ["shMines.jpg", sh, "One of the lowest levels of the Sun Haven mines"],
        ["shTownBirdbath.jpg", sh, "A birdbath in a sitting area in town"],
        ["shTownWest.jpg", sh, "West of Sun Haven town"],

        ["svFarm2021.png", sv, "Osiris' farm, circa 2021"],
        ["svFarm2022.png", sv, "Osiris' farm, circa 2022"],
        ["svGingerIsland.png", sv, "Osiris' Ginger Island farm"],
        ["svGingerIslandFront.png", sv, "The boat entry beach for Ginger Island"],
        ["svMountains.png", sv, "The mountains of Stardew Valley"],
        ["svTown.png", sv, "The main town of Stardew Valley"],

        ["tCrystalCave.png", t, "A beautiful crystal cave"],
        ["tDesertHouse.png", t, "Osiris fishing from the second floor porch of her house in the desert"],
        ["tForestHouse.png", t, "A sloping, beautiful house in the forest, built painstakingly from rich mahogany wood and decorated lavishly with souveniers from around the world"],
        ["tJungleHouse.png", t, "A set of jungle apartments, standing tall amongst the rich mahogany trees and bright green landscape"],
        ["tMushroomHouse.png", t, "A house made of mushrooms buried into a sloping hill"],
        ["tOceanHouse.png", t, "A quiet, idyllic house sitting lonely just before the ocean"],
        ["tSnowHouse.png", t, "A cozy, compact house keeping out the cold of the snowy boreal forest"],
        ["tWorldMap.png", t, "The map of my completed (and first ever) Terraria world"],

        ["tmaDesertBase.png", tma, "A savior in the scorching hot desert, this base was sturdily built of strong clay to last under the unforgiving sun"],
        ["tmaJungleBase.png", tma, "Shaped to look like a cute slime, this small abode serves as a safehouse from the beautiful dangers of the surrounding jungle"],
        ["tmaMainBase.png", tma, "A sprawling, segmented, sandstone build, hoisted into the sky by lush, green, floating islands"],
        ["tmaOceanBase.png", tma, "Built right next to the open ocean, this base's color palette blends right in with the sandy seashore"],
        ["tmaShimmerBase.png", tma, "Curious about the elusive properties of the newly discovered 'shimmer', a base was built by a lake of it to study the intriguing liquid"],
        ["tmaShroomBase.png", tma, "A beautiful collision of shimmer's atmospheric changes and the hypnotizing bioluminescence of mushrooms, this small biome is enough to bring awe to any eye"],

        ["tmoJungleHouse.png", tmo, "A house in the jungle buried safely into the side of a hill"],
        ["tmoOceanHouse.png", tmo, "An ocean base of operations, covered in golden trophies signaling victory in several battles"]
    ];
    
    //setup section: happens on first slideshow() call only
    if (backNext == "none"){
        randomIndex = rng(images.length); //assign a random index in images[] to be the image to display
        displayImage(id, images, randomIndex); //display image
        currentIndex = randomIndex; //indexing will no longer be random (for as long as the user is on this instance of the page)
        timesClicked = 0; //counting the number of times all buttons on this page (excluding the navbar buttons) are clicked
    }
    
    //happens only when next/back/random button is clicked
    if (backNext != "none"){
        if (backNext == "back"){ //if back button is clicked
            currentIndex -= 1; //send currentIndex to the previous image in images[]

            if (currentIndex < 0){ //if currentIndex counts below available indexes (i.e. 0)
                currentIndex = images.length - 1; //send currentIndex to the end of images[]
            }
        }
        else if (backNext == "next"){ //if next button is clicked
            currentIndex += 1; //send currentIndex to the next image in images[]

            if (currentIndex > images.length - 1){ //if currentIndex counts above available indexes
                currentIndex = 0; //send currentIndex to the beginning of images[]
            }
        }
        else if (backNext == "random"){ //if random button is clicked
            currentIndex = rng(images.length); //assign a random index in images[] to be the image to display
        }
        timesClicked += 1; //any button clicked, this increments
    }

    if (timesClicked == 3){ //if all buttons on this page (excluding the navbar buttons) have been clicked at least three times
        document.getElementById("controlButtons").innerHTML += `<button id = "secretButton" type = "button" onclick = "secretButton();">Secret Button?</button>`; //this button appears
    }
    
    displayImage(id, images, currentIndex); //display the image corresponding to the new index
}

//activates when the secret button is clicked
function secretButton(){
    window.open("secret-recs.html", "_blank");
}

//code-saving function for writing reference lists in a for loop
function setReferences(id, info){
    links = "";
    
    for (a = 0; a < info.length; a++){ //iterate through the list of reference information
        // document.getElementById(id).innerHTML += i;

        links += `
        <p>` + info[a][0] + `:<br>
            <a target = "_blank" href = "` + info[a][1] + `">` + info[a][2] + `</a>
        </p>`; //create link instances for each one until the end of info[]
    }

    document.getElementById(id).innerHTML += links;
}

//sets the site title and subtitle to user inputted values
function titleSubtitle(){
    //catches and disallows empty user submissions for the page title and subtitle
    if (document.getElementById("titles").elements["title"].value.length == 0 || document.getElementById("titles").elements["subtitle"].value.length == 0) {
        titleReset();
    }
    else{ 
        document.getElementById("pageTitle").innerHTML = document.getElementById("titles").elements["title"].value;
        document.getElementById("pageSubtitle").innerHTML = "<i>" + document.getElementById("titles").elements["subtitle"].value + "</i>";
    }
}

//resets the site title and subtitle to default values
function titleReset(){
    document.getElementById("pageTitle").innerHTML = "In the Eye of a Thousand Pictures";
    document.getElementById("pageSubtitle").innerHTML = "<i>An elaborate display of video games and their music, genres, and art</i>";
}

//sets the row colors to user inputted values
function rows(){
    rowsPlainColor = document.getElementById("rows").elements["rowsPlain"].value; //save the user inputted form color values
    rowsBeigeColor = document.getElementById("rows").elements["rowsBeige"].value;

    rowsPlain = document.getElementsByClassName("row"); //saves all [row] class elements on the page as an array
    rowsBeige = document.getElementsByClassName("row beige"); //saves all [row beige] class elements on the page as an array

    for (a = 0; a < rowsPlain.length - 1; a++){ //goes through the rowsPlain array. -1 to avoid changing the color of the footer (that shouldn't happen, but here we are)
        rowsPlain[a].setAttribute("style", "background-color: " + rowsPlainColor + ";"); //sets the background colors to the user inputted color
    }

    for (b = 0; b < rowsBeige.length; b++){ //goes through the rowsBeige array
        rowsBeige[b].setAttribute("style", "background-color: " + rowsBeigeColor + ";"); //sets the background colors to the user inputted color
    }

    //displays the colors selected in hex
    document.getElementById("colorInfo").innerHTML = "<i>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + rowsPlainColor + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + rowsBeigeColor + "</i>";
}

//converts hsl to hex
function hslToHex(h, s, l){
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

//generates a random hex color; for use in rowsRandom()
function randomHex(){
    validHex = "1234567890abcdef"; //every valid hex character
    color = '#'; //html color code starts with #
    
    for (c = 0; c < 6; c++){ //generating a random hex code consisting of 6 randomly chosen letters or numbers from validHex
        color += validHex[(Math.floor(Math.random() * 16))];
    }

    return color;
}

//randomizes the row colors
function rowsRandom(){
    //setting the color pickers to two randomly generated
    document.getElementById("rows").elements["rowsPlain"].value = randomHex();
    document.getElementById("rows").elements["rowsBeige"].value = randomHex();

    //calling rows() to set the row colors to these values
    rows();
}

//randomizes the row colors using only pastel values
function rowsPastel(){
    //setting the color pickers to two randomly generated hex values converted from pastel-only hsl values
    document.getElementById("rows").elements["rowsPlain"].value = hslToHex(Math.floor((Math.random() * 255) + 1), 47, 80);
    document.getElementById("rows").elements["rowsBeige"].value = hslToHex(Math.floor((Math.random() * 255) + 1), 47, 80);

    //calling rows() to set the row colors to these values
    rows();
}

//resets the row colors to default values
function rowsReset(){
    for (a = 0; a < rowsPlain.length - 1; a++){ //goes through the rowsPlain array
        rowsPlain[a].setAttribute("style", "background-color: rgba(215, 205, 192, 0.725);"); //sets the background colors to the user inputted color
    }

    for (b = 0; b < rowsBeige.length; b++){ //goes through the rowsBeige array
        rowsBeige[b].setAttribute("style", "background-color: rgba(187, 172, 152, 0.289);"); //sets the background colors to the user inputted color
    }

    //setting the color pickers back to the default colors visually
    document.getElementById("rows").elements["rowsPlain"].value = "#d7cdc0";
    document.getElementById("rows").elements["rowsBeige"].value = "#bbac98";

    //displays the default colors in hex
    document.getElementById("colorInfo").innerHTML = "<i>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp #d7cdc0 &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp #bbac98<br>Default row colors properly displayed as rgba values:<br>(215, 205, 192, 0.725), (187, 172, 152, 0.289)</i>";
}

backgroundColor = ""; //global variable to capture default background color of a table row on vgm.html
eGlobal = ""//global variable to capture the current mousover'ed element

//highlights a table row and plays the applicable song upon hovering over a table row
function mOver(e){
    //if the mousover'ed element has a class of 'song' (which only table rows with songs have)
    if (e.target.parentNode.getAttribute("class") == "song"){
        eGlobal = e
        document.getElementById("songDisplay").innerHTML = "Song: " +  e.target.parentNode.getAttribute("id"); //changes the section title to display the row's song
        backgroundColor = e.target.parentNode.style.backgroundColor; //captures default background color of the row and saves it to global variable
        e.target.parentNode.setAttribute("style", "background-color: rgb(255,156,124);"); //highlight table row with a distinct color

        interval = setInterval(colorShift, 30);
    }
}

//creates an effect of colors slowly shifting over setInterval time
function colorShift(){
    bgc = eGlobal.target.parentNode.style.backgroundColor; //getting the background color of what the mouse is currently over
    toParse = bgc.slice(4, bgc.length - 1).split(", "); //splitting the colors of the background color into an array like so: [r, g, b] (where each letter is a corresponding int)

    rInitial = toParse[0];
    gInitial = toParse[1];
    bInitial = toParse[2];

    r = parseInt(toParse[0]) + 1; //increasing the r/g/b values by 1 each time the function is called
    g = parseInt(toParse[1]) + 1;
    b = parseInt(toParse[2]) + 1;

    if (r >= 255){ r = rInitial; } //if any value goes above 255 (which is not possible for rgb), set it back to 0
    if (g >= 255){ g = gInitial; }
    if (b >= 255){ b = bInitial; }

    newColor = "rgb(" + r + "," + g + "," + b + ")"; //putting the new rgb value into a string
    eGlobal.target.parentNode.style.backgroundColor = newColor; //setting the background color of what the mouse is currently over to newColor
}

//un-highlights a table row and stops playing the music when the mouse leaves a table row
function mOut(e){
    if (e.target.parentNode.getAttribute("class") == "song"){
        clearInterval(interval); //halts the color shifting from colorShift

        document.getElementById("songDisplay").innerHTML = "-MUSIC RECOMMENDATIONS-"; //change the title of this bootstrap row back to what it normally is
        e.target.parentNode.setAttribute("style", "background-color: " + backgroundColor); //set table row background color to its original color
    }
}

//adds a textbox to a form to send a developer link if the appropriate checkbox is checked
//removes the textbox from the form if the appropriate checkbox is removed
function websiteCheck(e){

    if (e.target.getAttribute("id") == "developerWebsite"){ //if the object clicked has the id developerWebsite
        
        if (e.target.checked == true){
            document.getElementById("devSite").setAttribute("style", "display: inline;"); //adding the developer site link when the checkbox is checked
        }
        else{
            document.getElementById("devSite").setAttribute("style", "display: none;"); //removing the developer site link when the checkbox is unchecked

        }
    }
}