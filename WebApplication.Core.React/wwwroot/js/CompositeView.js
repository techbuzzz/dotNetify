﻿"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var Scope = dotnetify.react.Scope;

var CompositeView = React.createClass({
   displayName: "CompositeView",

   render: function render() {
      return React.createElement(
         "div",
         { className: "container-fluid" },
         React.createElement(
            "div",
            { className: "header clearfix" },
            React.createElement(
               "h3",
               null,
               "Example: Composite View"
            )
         ),
         React.createElement(
            MuiThemeProvider,
            null,
            React.createElement(
               Scope,
               null,
               React.createElement(AFITop100, null)
            )
         )
      );
   }
});

var AFITop100 = React.createClass({
   displayName: "AFITop100",

   contextTypes: { connect: React.PropTypes.func },

   getInitialState: function getInitialState() {
      return this.context.connect("AFITop100VM", this) || {};
   },
   componentWillUnmount: function componentWillUnmount() {
      this.vm.$destroy();
   },
   render: function render() {
      var iconMovie = React.createElement(IconMovie, { style: { color: "white" } });
      return React.createElement(
         Scope,
         { vm: "AFITop100VM" },
         React.createElement(
            "div",
            null,
            React.createElement(
               "div",
               { className: "row" },
               React.createElement(
                  "div",
                  { className: "col-md-12" },
                  React.createElement(AppBar, { title: "AFI's 100 Greatest American Films of All Time",
                     iconElementLeft: iconMovie,
                     iconStyleLeft: { marginTop: "20px" },
                     style: { marginBottom: "1em" } })
               )
            ),
            React.createElement(
               "div",
               { className: "row" },
               React.createElement(
                  "div",
                  { className: "col-md-8" },
                  React.createElement(
                     Scope,
                     { vm: "FilterableMovieTableVM" },
                     React.createElement(MovieTable, null)
                  )
               ),
               React.createElement(
                  "div",
                  { className: "col-md-4" },
                  React.createElement(MovieDetails, null),
                  React.createElement("br", null),
                  React.createElement(
                     Scope,
                     { vm: "FilterableMovieTableVM" },
                     React.createElement(MovieFilter, null)
                  )
               )
            )
         )
      );
   }
});

var MovieTable = React.createClass({
   displayName: "MovieTable",

   contextTypes: { connect: React.PropTypes.func },

   getInitialState: function getInitialState() {
      return this.context.connect("MovieTableVM", this) || {};
   },
   componentWillUnmount: function componentWillUnmount() {
      this.vm.$destroy();
   },
   render: function render() {
      var _this = this;

      return React.createElement(PaginatedTable, { colWidths: ["1em", "20%", "4em", "40%", "20%"],
         headers: this.state.Headers,
         data: this.state.Data,
         itemKey: this.state.ItemKey,
         select: this.state.SelectedKey,
         pagination: this.state.Pagination,
         page: this.state.SelectedPage,
         onSelect: function (id) {
            return _this.dispatchState({ SelectedKey: id });
         },
         onSelectPage: function (page) {
            return _this.dispatchState({ SelectedPage: page });
         } });
   }
});

var MovieDetails = React.createClass({
   displayName: "MovieDetails",

   contextTypes: { connect: React.PropTypes.func },

   getInitialState: function getInitialState() {
      return this.context.connect("MovieDetailsVM", this) || { Movie: {} };
   },
   componentWillUnmount: function componentWillUnmount() {
      this.vm.$destroy();
   },
   render: function render() {
      var movie = this.state.Movie || {};
      var casts = movie.Cast ? movie.Cast.split(",") : [];

      return React.createElement(
         Card,
         null,
         React.createElement(CardHeader, { title: movie.Movie, subtitle: movie.Year,
            titleStyle: { color: "#ff4081", fontSize: "large" },
            style: { borderBottom: "solid 1px #e6e6e6" } }),
         React.createElement(
            CardText,
            null,
            React.createElement(
               "p",
               null,
               React.createElement(
                  "b",
                  null,
                  "Director"
               ),
               React.createElement("br", null),
               movie.Director,
               React.createElement("br", null)
            ),
            React.createElement(
               "p",
               null,
               React.createElement(
                  "b",
                  null,
                  "Cast"
               ),
               React.createElement("br", null),
               casts.map(function (cast, idx) {
                  return React.createElement(
                     "span",
                     { key: idx },
                     cast,
                     React.createElement("br", null)
                  );
               })
            )
         )
      );
   }
});

var MovieFilter = React.createClass({
   displayName: "MovieFilter",

   contextTypes: { connect: React.PropTypes.func },
   getInitialState: function getInitialState() {
      // Combine state from back-end with local state.
      // This can be more concise using Object.assign if not for IE 11 support.
      var state = this.context.connect("MovieFilterVM", this) || {};
      var localState = {
         filters: [],
         filterId: 0,
         filter: "Any",
         operation: "has",
         operations: ["has"],
         text: "" };
      for (var prop in localState) state[prop] = localState[prop];
      return state;
   },
   componentWillUnmount: function componentWillUnmount() {
      this.vm.$destroy();
   },
   render: function render() {
      var _this2 = this;

      var movieProps = ["Any", "Rank", "Movie", "Year", "Cast", "Director"];
      var iconApply = React.createElement(IconFilter, null);

      var filterProps = movieProps.map(function (prop, idx) {
         return React.createElement(MenuItem, { key: idx, value: prop, primaryText: prop });
      });
      var filterOperations = this.state.operations.map(function (prop, idx) {
         return React.createElement(MenuItem, { key: idx, value: prop, primaryText: prop });
      });

      var updateFilterDropdown = function updateFilterDropdown(value) {
         _this2.setState({ filter: value });
         if (value == "Rank" || value == "Year") _this2.setState({ filter: value, operations: ["equals", ">=", "<="], operation: "equals" });else _this2.setState({ filter: value, operations: ["has"], operation: "has" });
      };

      var handleApply = function handleApply() {
         var newId = _this2.state.filterId + 1;
         var filter = { id: newId, property: _this2.state.filter, operation: _this2.state.operation, text: _this2.state.text };
         _this2.setState({ filterId: newId, filters: [filter].concat(_toConsumableArray(_this2.state.filters)), text: "" });
         _this2.dispatch({ Apply: filter });

         updateFilterDropdown("Any"); // Reset filter dropdown.
      };

      var handleDelete = function handleDelete(id) {
         _this2.dispatch({ Delete: id });
         _this2.setState({ filters: _this2.state.filters.filter(function (filter) {
               return filter.id != id;
            }) });
      };

      var filters = this.state.filters.map(function (filter) {
         return React.createElement(
            Chip,
            { key: filter.id, style: { margin: 4 }, onRequestDelete: function () {
                  return handleDelete(filter.id);
               } },
            filter.property,
            " ",
            filter.operation,
            " ",
            filter.text
         );
      });

      return React.createElement(
         Card,
         null,
         React.createElement(CardHeader, { title: "Filters", style: { borderBottom: "solid 1px #e6e6e6" } }),
         React.createElement(
            CardText,
            null,
            React.createElement(
               "div",
               { className: "row" },
               React.createElement(
                  "div",
                  { className: "col-md-4" },
                  React.createElement(
                     SelectField,
                     { fullWidth: true,
                        value: this.state.filter,
                        onChange: function (event, idx, value) {
                           return updateFilterDropdown(value);
                        } },
                     filterProps
                  )
               ),
               React.createElement(
                  "div",
                  { className: "col-md-4" },
                  React.createElement(
                     SelectField,
                     { fullWidth: true,
                        value: this.state.operation,
                        onChange: function (event, index, value) {
                           return _this2.setState({ operation: value });
                        } },
                     filterOperations
                  )
               ),
               React.createElement(
                  "div",
                  { className: "col-md-4" },
                  React.createElement(TextField, { id: "FilterText", fullWidth: true,
                     value: this.state.text,
                     onChange: function (event) {
                        return _this2.setState({ text: event.target.value });
                     } })
               )
            ),
            React.createElement(
               "div",
               { className: "row" },
               React.createElement(
                  "div",
                  { className: "col-md-12", style: { display: 'flex', flexWrap: 'wrap' } },
                  filters
               )
            )
         ),
         React.createElement(
            CardActions,
            null,
            React.createElement(FlatButton, { label: "Apply", icon: iconApply,
               onClick: handleApply,
               disabled: this.state.text.length == 0 })
         )
      );
   }
});

