/**
 * Name: Miya Nakata
 * Date: May 4, 2023
 * Section: CSE 154 AA, TA: Elias Martin
 * This is the index.js page for my CP3. It is in charge of handling interactions between the
 * webpage and the MET API along with all the functionalities of the webpage.
 */

"use strict";
(function() {
  const BASE_URL = "https://collectionapi.metmuseum.org";
  let objId = null;

  window.addEventListener("load", init);

  /**
   * Sets up the inital document handlers for the webpage
   */
  function init() {
    let searchBtn = id("search-btn");
    searchBtn.addEventListener("click", requestRandObj);
    let revealBtn = id("reveal-btn");
    revealBtn.addEventListener("click", requestObjInfo);
  }

  /**
   * Gets a list of all the object id's in the MET's catalog and randomly selects one.
   */
  async function requestRandObj() {
    let url = BASE_URL + "/public/collection/v1/objects";
    try {
      let response = await fetch(url);
      await statusCheck(response);
      let objectsArr = await response.json();
      let randNum = Math.floor(Math.random() * objectsArr["total"]);
      objId = objectsArr["objectIDs"][randNum];
      objIdSuccess();
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Replaces image of the old art piece with the MET logo after a new object ID has been selected.
   */
  function objIdSuccess() {
    let success = gen("p");
    success.textContent = "Art selected! Now click Reveal Art.";
    success.classList.add("success-msg");
    let metImg = gen("img");
    metImg.src = "the-met-logo.jpg";
    metImg.alt = "the MET logo";
    id("desc-card").innerHTML = "";
    id("desc-card").appendChild(success);
    id("art-card").replaceChild(metImg, qs("article img"));
  }

  /**
   * Fetches the art piece's information from the MET API and generates the response on the webpage.
   */
  async function requestObjInfo() {
    let url = BASE_URL + "/public/collection/v1/objects/" + objId;
    try {
      let response = await fetch(url);
      await statusCheck(response);
      let objInfo = await response.json();
      generateArtDisplay(objInfo);
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Gets the art piece's relevant information and updates the DOM to include that info.
   * @param {String} objInfo - the objectID of the specific art piece
   */
  function generateArtDisplay(objInfo) {
    // art display card
    changeArtCard(objInfo);
    changeDescCard(objInfo);
  }

  /**
   * Changes the image in the frame to a photo of the art.
   * @param {String} objInfo - the objectID of the specific art piece
   */
  function changeArtCard(objInfo) {
    let artImg = gen("img");
    artImg.src = objInfo["primaryImage"];
    artImg.alt = objInfo["title"] + " (" + objInfo["objectDate"] + ")";
    id("art-card").replaceChild(artImg, qs("article img"));
  }

  /**
   * Changes the description card to match the information about the current art piece.
   * @param {String} objInfo - the objectID of the specific art piece
   */
  function changeDescCard(objInfo) {
    id("desc-card").innerHTML = "";
    let title = gen("p");
    title.textContent = objInfo["title"] + " (" + objInfo["objectDate"] + ")";
    let strong = gen("strong");
    strong.textContent = title.textContent;
    id("desc-card").appendChild(strong);
    let descList = gen("ul");
    id("desc-card").appendChild(descList);
    let bio = gen("li");
    bio.textContent = "About: " + objInfo["artistPrefix"] + " " +
                      objInfo["artistDisplayName"] + " " + objInfo["period"];
    qs("ul").appendChild(bio);
    let medium = gen("li");
    medium.textContent = "Medium: " + objInfo["medium"];
    qs("ul").appendChild(medium);
    let dimensions = gen("li");
    dimensions.textContent = "Dimensions: " + objInfo["dimensions"];
    qs("ul").appendChild(dimensions);
    let department = gen("li");
    department.textContent = "Department: " + objInfo["department"];
    qs("ul").appendChild(department);
    let source = gen("li");
    source.textContent = "Credit: " + objInfo["creditLine"];
    qs("ul").appendChild(source);
  }

  /**
   * Error handler function takes whatever error message occured and pastes it on the webpage.
   * @param {String} err - the error message from either request function calls
   */
  function handleError(err) {
    let pTag = gen("p");
    pTag.textContent = "Error: " + err;
    qs("body").appendChild(pTag);
  }

  /**
   * Checks to ensure no errors occured in fetching data from the API.
   * @param {*} res - the Promise object from the fetch call
   * @return {String} the error text or the Promise object
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Creates a new DOM element
   * @param {String} tagName - name of new DOM element
   * @return {DOMElement} newly created DOM element with the tagName
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Finds the element with the specified id attribute.
   * @param {string} id - element id
   * @returns {HTMLElement} the DOM node with the id name.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Finds the first occurance of an element that matches the selector
   * @param {String} selector - element name of any combinatorial
   * @returns {DOMElement} the first element that would be matched by the given CSS selector string
   */
  function qs(selector) {
    return document.querySelector(selector);
  }
})();