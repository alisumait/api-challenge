const express = require("express");
const Model = require("./db/models/comment_model");
const app = express();
const bodyParser = require("body-parser");
const { existsOnGithub } = require("./apiFunctions");

app.use(bodyParser.json());

app.get("/orgs/:org/comments", async (req, res) => {
  const organizationParam = req.params.org;

  // aggregates organization's comments that aren't soft-deleted via $filter condition
  await Model.Organization.aggregate([
    { $match: { organization: organizationParam } },
    {
      $project: {
        organization: organizationParam,
        comments: {
          $filter: {
            input: "$comments",
            as: "comment",
            cond: { $eq: ["$$comment.isDeleted", false] }
          }
        }
      }
    }
  ])
    .then(organizationComments => {
      if (organizationComments.length === 0) {
        throw new Error("Organization does not exist");
      }
      res.status(200).json(organizationComments);
    })
    .catch(err => res.status(400).send({ error: err.message }));
});

app.post("/orgs/:org/comments", async (req, res) => {
  const organizationParam = req.params.org;
  const exists = await existsOnGithub(organizationParam);

  // return error if organization doesn't exist on Github. Else, post comment
  if (exists === false) {
    res.status(404).send({
      error: "Organization does not exist on Github"
    });
    //seperate into other function
  } else {
    const comment = new Model.Comments({ comment: req.body.comment });
    Model.Organization.findOne({ organization: organizationParam })
      .then((org) => {
        // if it's first posted comment, create new oranization parent document
        const organizationComments = org ? org : new Model.Organization({ organization: organizationParam });
        organizationComments.comments.push(comment);
        organizationComments.save()
          .then(() =>
            res.status(200).json({
              comment
            })
          )
          .catch(err =>
            res.status(400).send({
              error: err.message
            })
          );
      })
      .catch(err =>
        res.status(400).send({
          error: err.message
        })
      );
  }
});

app.delete("/orgs/:org/comments", async (req, res) => {
  const organizationParam = req.params.org;

  // loop throgh comments of an organization and set isDeleted to true for soft-delete
  await Model.Organization.findOne({ organization: organizationParam })
    .then(organization => {
      if (organization === null) {
        throw new Error("Organization does not exist");
      }
      organization.comments.forEach(comment => {
        comment.isDeleted = true;
      });
      organization
        .save()
        .then(() => {
          res.status(200).send({ success: "Comments were soft-deleted successfully!" });
        })
        .catch(err => res.status(400).send({ error: err.message }));
    })
    .catch(err => res.status(400).send({ error: err.message }));
});

module.exports = app;
