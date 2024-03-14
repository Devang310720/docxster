let Country = '';
let Region = '';
let Status = '';
let TaxArea = '';
let TaxQualification = '';
let TaxType = '';
var keyValuePairs = []
var queryString = ''

document.addEventListener("DOMContentLoaded", function () {

    var currentPage = 1;
    var articleCount = 0;
    var responseData = [];
    var fetchingData = false;
    var responseDataLength = 0;
    var totalResponseDataLength = 0;
    var baseUrl = `https://api.docxster.ai/api/taxai/getData?pageNo=${currentPage}`
    var nextPageButton = document.getElementById("nextPage");
    var previousPageButton = document.getElementById("previousPage");
    var totallength = 0;


    nextPageButton.addEventListener("click", function () {
        nextPage();
    });

    previousPageButton.addEventListener("click", function () {
        previousPage();
    });



    const dropdowns = document.querySelectorAll('.w-dropdown-list');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function (event) {
            const selectedValue = event.target.textContent;
            const dropdownID = event.target.parentNode.id;
            if (dropdownID === 'w-dropdown-list-1-country') {
                Country = selectedValue;
            } else if (dropdownID === 'w-dropdown-list-1-region') {
                Region = selectedValue;
            } else if (dropdownID === 'w-dropdown-list-1-status') {
                Status = selectedValue;
            } else if (dropdownID === 'w-dropdown-list-1-taxarea') {
                TaxArea = selectedValue;
            } else if (dropdownID === 'w-dropdown-list-1-taxqualification') {
                TaxQualification = selectedValue;
            } else if (dropdownID === 'w-dropdown-list-1-taxtype') {
                TaxType = selectedValue;
            }

            if (selectedValue) {
                const elementsWithClass = document.getElementsByClassName('w-dropdown-list');
                for (let i = 0; i < elementsWithClass.length; i++) {
                    elementsWithClass[i].style.display = 'none';
                }

            }

            const inputObject = { Country, Region, Status, TaxArea, TaxQualification, TaxType };
            for (const key in inputObject) {
                const value = inputObject[key];

                if (value !== "") {
                    keyValuePairs.push(`${key}=${value}`);
                }
            }
            currentPage = 1
            queryString = keyValuePairs.join('&');
            const baseUrlParts = baseUrl.split('?');
            if (baseUrlParts.length > 1) {
                baseUrl = baseUrlParts[0];
            }


            if (queryString) {
                baseUrl += `?pageNo=${currentPage}&${queryString}`;
                fetchData();
            }
        });
    });

    async function fetchData() {
        try {

            const response = await fetch(baseUrl);
            keyValuePairs = []
            if (response.ok) {
                const data = await response.json();
                articleCount = data.articleCount;
                responseData = [...data.data];

                responseDataLength = responseData.length;
                totallength += responseDataLength

                const nextPageButton = document.getElementById("nextPage");
                const page = data.totalPages
                console.log(responseDataLength, 'Hello Length')
                if (responseDataLength === 0) {
                    var container = document.getElementById("container");
                    container.innerHTML = "";
                    var noData = '';
                    noData += `
                            <div class="no-data">
                                No Data Found
                            </div>
                          `;
                    container.insertAdjacentHTML("beforeend", noData);
                    nextPageButton.setAttribute("disabled", true);
                    nextPageButton.classList.add("disabled-button");
                    return
                }

                var container = document.getElementById("container");
                container.innerHTML = "";
                var container = document.getElementById("container");
                for (var i = 0; i < responseData.length; i++) {
                    var paginationData = responseData[i];
                    var createdDate = new Date(paginationData.CreatedAt);
                    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    var day = createdDate.getDate();
                    var month = monthNames[createdDate.getMonth()];
                    var year = createdDate.getFullYear();

                    var formattedDate = day + ' ' + month + ', ' + year;

                    var htmlContent = '';
                    htmlContent += `
                          <div class="tax-block">
                          <div class="w-layout-hflex dummy-title">
                              <div class="w-layout-hflex country-block">
                                  <div class="country-title-block">
                                      <div class="country-block-title titles">Country :</div>
                                  </div>
                                  <div class="country-name-block">
                                      <div class="country">${paginationData.Country}</div>
                                  </div>
                              </div>
                              <div class="w-layout-hflex tax-area-block">
                                  <div class="tax-area-title-block">
                                      <div class="tax-area-title titles">Tax Area :</div>
                                  </div>
                                  <div class="tax-area-name-block">
                                      <div class="tax-area">${paginationData.TaxArea}</div>
                                  </div>
                              </div>
                              <div class="w-layout-hflex type-block">
                                  <div class="type-title-block">
                                      <div class="type-title titles">Type :</div>
                                  </div>
                                  <div class="type-name-block-text">
                                      <div class="type">${paginationData.TaxType}</div>
                                  </div>
                              </div>
                          </div>
                          <div class="w-layout-hflex date-added-block">
                              <div class="date-added-text">
                                  ${formattedDate}
                              </div>
                          </div>
                          <div class="w-layout-hflex dummy-title-text-block">
                              <div class="dummy-title-text">
                                  ${paginationData.Title}
                              </div>
                          </div>
                          <div class="w-layout-hflex short-des-block">
                              <div class="short-des">
                                  ${paginationData.Description}
                              </div>
                          </div>
                          <div class="w-layout-hflex status-block">
                              <div class="status-text">
                                  ${paginationData.Status}
                              </div>
                          </div>
                          </div>
                          `;


                    container.insertAdjacentHTML("beforeend", htmlContent);
                    (function (index, data) {
                        const taxBlock = document.querySelectorAll('.tax-block')[index];
                        taxBlock.addEventListener('click', function (event) {

                            
                            event.preventDefault();
                            var url = data.Link;
                            console.log(url);
                            
                            fetch(url)
                            .then(response => response.text())
                            .then(data => {
                                
                                localStorage.setItem('myKey', url);
                                    window.location.href = "/texai-detail";
                                })
                                .catch(error => console.log(error));
                        });
                    })(i, paginationData);

                }

                if (currentPage === page) {
                    nextPageButton.setAttribute("disabled", true);
                    nextPageButton.classList.add("disabled-button");
                } else {
                    nextPageButton.removeAttribute("disabled");
                    nextPageButton.classList.remove("disabled-button");
                }
                const previousPageButton =
                    document.getElementById("previousPage");
                if (currentPage <= 1) {
                    previousPageButton.setAttribute("disabled", true);
                    previousPageButton.classList.add("disabled-button");
                } else {
                    previousPageButton.removeAttribute("disabled");
                    previousPageButton.classList.remove("disabled-button");
                }
            } else {
                console.error("Failed to fetch data");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }


    function previousPage() {
        if (currentPage >= 1) {
            currentPage--;
            makeUrl(currentPage)
            fetchData();
        }
    }

    function makeUrl(currentPage) {
        if (queryString) {
            baseUrl = `https://api.docxster.ai/api/taxai/getData?pageNo=${currentPage}&${queryString}`;
        } else {
            baseUrl = `https://api.docxster.ai/api/taxai/getData?pageNo=${currentPage}`;
        }
    }


    function nextPage() {
        currentPage++;
        makeUrl(currentPage)
        totalResponseDataLength += responseDataLength;
        fetchData();
    }

    fetchData();
});
