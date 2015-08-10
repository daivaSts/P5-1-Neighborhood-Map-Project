var names = [];
var object = {
    name: "Joe",
    age: 20,
    email: "joe@hotmail.com"
};
names.push(object);
object = {
    name: "Mike",
    age: 50,
    email: "mike@hotmail.com"
};
names.push(object);
object = {
    name: "Joe",
    age: 45,
    email: "mike@hotmail.com"
};
names.push(object);

var found_names = $.grep(names, function(v) {
    return v.name === "Joe";
});

console.log(found_names);
