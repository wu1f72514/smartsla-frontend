<template>
  <v-container grid-list-md v-if="request">
    <v-layout align-center justify-space-between row>
      <div>
        <router-link :to="{ name: 'Requests' }">
          <button><v-icon>arrow_back</v-icon></button>
        </router-link>
      </div>
    </v-layout>
    <v-layout row wrap justify-space-between>
      <v-flex xs12 md12 sm12 xl7 lg7 pt-4 px-0>
        <v-card light color="white">
          <ticket-status :status="request.status" :type="request.type"></ticket-status>
          <v-divider />
          <v-layout wrap>
            <v-flex xs8 md11 sm11 lg11 xl11 class="pt-0 pb-0">
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">#{{ request._id }} - {{ request.title }}</h3>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex xs4 md1 sm1 xl1 lg1 class="pt-0 pb-0">
              <div class="text-xs-right grey--text pt-3 justify-end">
                <v-btn
                  :disabled="!isAdmin"
                  color="primary"
                  fab
                  small
                  dark
                  :to="{ name: 'EditRequest', params: { id: request._id } }"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
          <v-divider class="pb-2" />
          <v-layout justify-center row fill-height wrap ml-3 class="custom-ticket-bl">
            <v-flex xs3 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Type") }} :</strong>
              {{ $t(request.type) }}
            </v-flex>

            <v-flex xs4 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Severity") }} :</strong>
              {{ $t(request.severity) }}
            </v-flex>
            <v-flex xs5 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Created at") }} :</strong>
              {{ ticketDate | formatDateFilter("llll") }}
            </v-flex>
            <v-flex xs3 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Created by") }} :</strong>
              {{ request.author && request.author.name }}
            </v-flex>

            <v-flex xs4 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Assigned to") }} :</strong>
              <assigned-to-user :user="request.assignedTo" :contractId="request.contract"> </assigned-to-user>
            </v-flex>

            <v-flex xs5 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Last update") }} :</strong>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span v-on="on"> {{ lastUpdate | relativeTime }}</span>
                </template>
                <span> {{ lastUpdate | formatDateFilter("llll") }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs3 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Software") }} :</strong>
              {{ request.software && request.software.software && request.software.software.name }}
            </v-flex>
            <v-flex xs4 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Version") }} :</strong>
              {{ request.software && request.software.software && request.software.version }}
            </v-flex>
            <v-flex xs5 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("OS") }} :</strong>
              {{ request.software && request.software.software && request.software.os }}
            </v-flex>
          </v-layout>
          <v-divider class="mt-2"></v-divider>
          <v-card>
            <v-card-text>
              <v-subheader inset class="ml-0">
                <v-icon>subject</v-icon>
                {{ $t("Description") }}
              </v-subheader>
              <div class="subject-text ml-3" v-html="request.description"></div>
            </v-card-text>
            <v-card-text v-if="request.participants && request.participants.length">
              <v-subheader inset class="ml-0">
                <v-icon>email</v-icon>
                {{ $t("Participants E-mails") }}
              </v-subheader>
              <v-layout>
                <v-flex xs12 class="pt-0 pl-0">
                  <v-chip v-for="(participant, index) in request.participants" :key="index" class="ma-2">
                    <a :href="`mailto:${participant}`">{{ participant }}</a>
                  </v-chip>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-text v-if="attachments && attachments.length">
              <v-list subheader two-line>
                <v-subheader inset class="ml-0">
                  <v-icon>attach_file</v-icon>
                  {{ $t("Attachments") }}
                </v-subheader>
                <template v-for="(attachment, index) in attachments">
                  <v-list-tile :key="attachment.id" ripple @click="downloadFile(attachment)">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ attachment.name }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-list-tile-action-text>{{
                        attachment.timestamps.createdAt | calendarTimeFilter
                      }}</v-list-tile-action-text>
                      <v-btn icon ripple class="ma-0" @click.stop="scrollToEvent(attachment.event)">
                        <v-icon color="grey lighten-1">info</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider v-if="index < attachments.length - 1" :key="attachment.id"></v-divider>
                </template>
              </v-list>
            </v-card-text>
            <v-card-text v-if="request.relatedRequests && request.relatedRequests.length">
              <v-subheader inset class="ml-0">
                <v-icon>insert_link</v-icon>
                {{ $t("Related requests") }}
              </v-subheader>
              <v-layout>
                <v-flex xs12 md11 sm8 xl10 lg10 pl-0>
                  <v-layout row wrap>
                    <v-flex xs6 md2 sm6 lg2 xl2 pl-0> </v-flex>
                    <v-flex xs10 md8 sm6 lg8 xl6 pl-0>
                      <ul v-if="request.relatedRequests">
                        <li v-for="(link, key) in request.relatedRequests" :key="key">
                          <router-link target="_blank" :to="{ name: 'Request', params: { id: link.request._id } }">
                            {{ `${link.link} : #${link.request._id} - ${link.request.title}` }}
                          </router-link>
                        </li>
                      </ul>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
          <v-card>
            <v-tabs icons-and-text class="comment-padding">
              <v-tabs-slider color="primary"></v-tabs-slider>
              <v-tab href="#comment">
                {{ $t("Comments") }}
                <v-chip small>{{ request.events.length }}</v-chip>
              </v-tab>
              <v-tab-item value="comment" class="mt-1">
                <v-timeline dense clipped>
                  <v-timeline-item
                    v-for="event in request.events"
                    :key="event._id"
                    medium
                    :ref="`event-${event._id}`"
                    :id="`event-${event._id}`"
                    :hide-dot="$vuetify.breakpoint.name === 'xs' ? true : false"
                  >
                    <template v-slot:icon v-if="$vuetify.breakpoint.name !== 'xs'">
                      <v-avatar size="30">
                        <v-img :src="`${apiUrl}/api/users/${event.author.id}/profile/avatar`"></v-img>
                      </v-avatar>
                    </template>
                    <v-card
                      flat
                      class="elevation-2"
                      :color="
                        event.isPrivate
                          ? 'red lighten-4'
                          : event.author.type === 'expert'
                          ? 'blue lighten-5'
                          : 'grey lighten-4'
                      "
                    >
                      <v-card-title primary-title class="pt-3">
                        <div class="flex">
                          <div class="subheading font-weight-medium">{{ event.author.name }}</div>
                          <div class="body-1">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <a
                                  v-on="on"
                                  class="event-time"
                                  :href="`#event-${event._id}`"
                                  @click.stop="scrollToEvent(event)"
                                >
                                  {{ event.timestamps.createdAt | relativeTime }}
                                </a>
                              </template>
                              <span>{{ event.timestamps.createdAt | formatDateFilter("llll") }}</span>
                            </v-tooltip>
                          </div>
                        </div>
                        <v-spacer></v-spacer>
                        <v-menu offset-y>
                          <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                              <v-icon color="grey">mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-tile @click="copyEventLink(event._id)">
                              <v-list-tile-title>{{ $t("Copy link") }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </v-card-title>
                      <v-card-text v-if="event.comment" v-html="event.comment" class="pt-0" />
                      <v-card-text v-if="(event.target && event.target.name) || event.status" class="grey--text pt-0">
                        <p
                          v-if="event.target && event.target.name"
                          v-html="
                            $t('Ticket assigned to {assignedTo}', {
                              assignedTo: event.target.name
                            })
                          "
                        ></p>
                        <p
                          v-if="event.status"
                          v-html="
                            $t('Ticket passed in status {status}', {
                              status: statusDisplay(event.status)
                            })
                          "
                        ></p>
                      </v-card-text>
                      <v-card-text v-if="event.attachments && event.attachments.length > 0" class="pt-0">
                        <v-icon>attach_file</v-icon>
                        <ul>
                          <li v-for="(attachment, index) in event.attachments" :key="index">
                            <a @click="downloadFile(attachment)">
                              {{ attachment.name }}
                            </a>
                          </li>
                        </ul>
                      </v-card-text>
                      <v-card-text v-if="event.changes" class="grey--text pt-0">
                        <p v-for="(eventChanges, index) in event.changes" :key="index" :parentData="event">
                          {{
                            $t(UPDATE_COMMENT[eventChanges.field][eventChanges.action], {
                              author: event.author.name,
                              oldValue: eventChanges.oldValue,
                              newValue: eventChanges.newValue
                            })
                          }}
                        </p>
                      </v-card-text>
                      <v-card-text v-if="request.survey && event.isSurvey" class="grey--text mt-0">
                        <v-icon>link</v-icon>
                        <a :href="getSurveyUrl()" target="_blank" style="text-decoration:none;">
                          {{ $t("Please fill out this survey") }}
                        </a>
                      </v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
                <v-divider></v-divider>
                <v-form class="comment-form">
                  <v-tabs v-model="isPrivateTab">
                    <v-tabs-slider color="primary"></v-tabs-slider>
                    <v-tab>{{ $t("Public comments") }}</v-tab>
                    <v-tab v-if="isUserExpert()">
                      {{ $t("Private Comments") }}
                    </v-tab>
                  </v-tabs>
                  <v-input prepend-icon="subject">
                    <!-- <v-btn-toggle v-model="selectedEditor">
                    <v-btn flat value="wysiwyg">{{ $t("wysiwyg Editor") }}</v-btn>
                    <v-btn flat value="markdown">{{ $t("Markdown Editor") }}</v-btn>
                  </v-btn-toggle>-->
                    <Editor
                      ref="editor"
                      :outline="true"
                      :preview="true"
                      v-model="comment"
                      v-if="selectedEditor == 'markdown'"
                      :disabled="isSubmitting"
                    />
                    <vue-editor
                      v-model="comment"
                      :disabled="isSubmitting"
                      :editorToolbar="editorToolbar"
                      :class="{ 'is-private-tab': isPrivateTab }"
                      v-else
                    ></vue-editor>
                    <br />
                  </v-input>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <attachments-creation
                        v-bind:attachments.sync="commentCreationAttachments"
                        :disabled="isSubmitting"
                      />
                    </v-flex>
                  </v-layout>
                  <v-input prepend-icon="no-icon" class="pt-2">
                    <v-layout row wrap>
                      <v-flex xs12 md6>
                        <v-select
                          v-if="!isPrivateTab"
                          :items="[allowedStatusList]"
                          v-model="newStatus"
                          :disabled="!allowedStatusList || isSubmitting"
                          :label="$t('Status')"
                        >
                          <template slot="item" slot-scope="{ item }">
                            {{ $t(capitalize(item)) }}
                          </template>
                          <template slot="selection" slot-scope="{ item }">
                            {{ $t(capitalize(item)) }}
                          </template>
                        </v-select>
                      </v-flex>
                      <v-flex v-if="!isPrivateTab" xs12 md6>
                        <user-list-assignment
                          :responsible.sync="newResponsible"
                          :request="request"
                          :isSubmitting="isSubmitting"
                          @assignCustomer="assignCustomer"
                          @assignSelf="assignSelf"
                          @assignTo="assignTo"
                        >
                        </user-list-assignment>
                      </v-flex>
                    </v-layout>
                  </v-input>
                  <v-layout row wrap id="submission">
                    <v-flex md4 class="hidden-sm-and-down"></v-flex>
                    <v-flex xs6 md4>
                      <v-layout row>
                        <v-btn
                          @click="addEvent(false)"
                          :disabled="isSubmitting"
                          :loading="isSubmitting"
                          color="info"
                          class="btn-submit"
                        >
                          {{ $t("Submit") }}
                        </v-btn>
                        <v-menu top pl-0 offset-y v-if="configuration.isLimesurveyEnabled && isUserExpert()">
                          <template v-slot:activator="{ on }">
                            <v-btn color="info" v-on="on" class="ml-0 px-1 btn-list">
                              <v-icon>arrow_drop_down</v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-tile @click="addEvent(true)" :disabled="surveySubmitted">
                              <v-list-tile-title
                                class="btn-action-list"
                                v-html="$t('Submit and send the survey')"
                              ></v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 xl5 lg5 sm12 pt-0 pl-2>
        <v-layout row wrap pt-0>
          <v-flex xs12 md12 sm12 xl12 lg12 pt-4>
            <v-card light color="white" class="px-4 pb-3">
              <v-card-title primary-title>
                <h3 class="headline mb-0">{{ $t("Service deadlines") }}</h3>
              </v-card-title>
              <v-divider></v-divider>
              <v-container v-if="request.contract && request.software && request.severity">
                {{ $t("cns.state.support") }}
                <cns-progress-bar :ticket="request" :cnsType="'supported'" class="pt-1"></cns-progress-bar>
                {{ $t("cns.state.bypass") }}
                <cns-progress-bar :ticket="request" :cnsType="'bypassed'"></cns-progress-bar>
                {{ $t("cns.state.resolution") }}
                <cns-progress-bar :ticket="request" :cnsType="'resolved'"></cns-progress-bar>
              </v-container>
              <v-container v-else>{{ $t("There is no service deadline for this ticket") }}</v-container>
            </v-card>
          </v-flex>
          <v-flex xs12 md12 sm12 xl12 lg12 pt-4 align-center justify-center>
            <h4 class="text-uppercase text-md-center text-xs-center blue white--text pt-2 pb-1">
              {{ $t("interlocutor in charge of the request") }}
            </h4>
            <v-card class="pt-2 px-3 nobottomshadow">
              <v-icon large color="blue" class="arrow-down pr-5 pt-1">play_arrow</v-icon>
              <v-layout row class="center-avatar">
                <v-flex shrink px-1 xs12 v-if="request.responsible">
                  <v-avatar size="60" class="pt-0">
                    <v-img :src="`${apiUrl}/api/users/${request.responsible._id}/profile/avatar`"></v-img>
                  </v-avatar>
                </v-flex>

                <v-flex grow xs8 class="px-0">
                  <v-card-text class="px-0" v-if="request.responsible">
                    <strong>{{ $t("Contact") }} :</strong>
                    {{ request.responsible && request.responsible.name }}
                    <br />
                    <strong>{{ $t("E-mail") }} :</strong>
                    {{ request.responsible && request.responsible.email }}
                    <br />
                    <span v-if="request.responsible && request.responsible.phone">
                      <strong>{{ $t("Phone") }} :</strong>
                      <a :href="`tel://${request.responsible.phone}`">
                        {{ request.responsible.phone }}
                      </a>
                    </span>
                  </v-card-text>
                  <v-card-text v-else>
                    <h4>{{ $t("No interlocutor in charge of the request at the moment") }}</h4>
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
            <h4 class="text-uppercase text-md-center text-xs-center blue white--text pt-2 pb-1">
              {{ $t("Beneficiary") }}
            </h4>
            <v-card class="pt-2 px-3">
              <v-icon large class="arrow-down pr-5 pt-1 blue-color">play_arrow</v-icon>
              <v-layout row class="center-avatar">
                <v-flex shrink px-1 xs12>
                  <v-avatar size="60" class="pt-0" v-if="request.beneficiary">
                    <v-img :src="`${apiUrl}/api/users/${request.beneficiary.id}/profile/avatar`"></v-img>
                  </v-avatar>
                </v-flex>
                <v-flex grow xs8 class="px-0">
                  <v-card-text class="px-0">
                    <span class="d-block">
                      <strong>{{ $t("Contact") }} :</strong>
                      {{ request.beneficiary && request.beneficiary.name }}
                    </span>
                    <span class="d-block">
                      <span class="body-2">{{ $t("Client") }} / {{ $t("Contract") }} :&nbsp;</span>
                      <client-contract-links :contractId="request.contract"></client-contract-links>
                    </span>
                    <span v-if="request.beneficiary">
                      <strong>{{ $t("Phone") }} :</strong>
                      <a :href="`tel://${request.beneficiary.phone || request.callNumber}`">
                        {{ request.beneficiary.phone || request.callNumber }}
                      </a>
                    </span>
                    <span v-if="request.meetingId && request.meetingId.length">
                      <strong>{{ $t("meeting ID") }} :</strong>
                      {{ request.meetingId }}
                    </span>
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex xs12 md12 sm12 xl12 lg12 pt-4>
            <RelatedContributions
              :contributions="request.relatedContributions"
              :ticketId="request._id"
              @update="fetchTicket"
            ></RelatedContributions>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { VueEditor } from "vue2-editor";
import { flatten, capitalize } from "lodash";
import { Editor } from "vuetify-markdown-editor";
import AttachmentsCreation from "@/components/attachments/creation/Attachments.vue";
import ApplicationSettings from "@/services/application-settings";
import editorToolbar from "@/services/helpers/default-toolbar";
import cnsProgressBar from "@/components/CnsProgressBar";
import { UPDATE_COMMENT, ANOMALY_NEXT_STATUS, NEXT_STATUS, REQUEST_TYPE, USER_TYPE } from "@/constants.js";
import ClientContractLinks from "@/components/request/ClientContractLinks";
import AssignedToUser from "@/components/request/AssignedToUser";
import UserListAssignment from "@/components/request/UserListAssignment";
import RelatedContributions from "@/components/request/RelatedContributions";
import surveyUrl from "@/services/limesurvey/limesurvey.js";
import TicketStatus from "@/components/request/TicketStatus";

export default {
  data() {
    return {
      commentCreationAttachments: [],
      selectedEditor: "wysiwyg",
      isSubmitting: false,
      newStatus: "",
      newResponsible: {},
      comment: "",
      UPDATE_COMMENT: UPDATE_COMMENT,
      isPrivateTab: null
    };
  },
  components: {
    VueEditor,
    Editor,
    AttachmentsCreation,
    "cns-progress-bar": cnsProgressBar,
    ClientContractLinks,
    AssignedToUser,
    UserListAssignment,
    RelatedContributions,
    TicketStatus
  },
  computed: {
    ...mapGetters({
      getUser: "user/getUser",
      configuration: "configuration/getConfiguration"
    }),

    request() {
      return this.$store.getters["ticket/getTicketById"](this.$route.params.id);
    },

    lastUpdate() {
      return new Date(this.request.timestamps.updatedAt);
    },

    ticketDate() {
      return new Date(this.request.timestamps.createdAt);
    },

    attachments() {
      const attachments =
        this.request.events &&
        this.request.events.map(event => {
          return (event.attachments || []).map(attachment => {
            attachment.timestamps = event.timestamps;
            attachment.event = event;

            return attachment;
          });
        });

      return flatten(attachments);
    },

    surveySubmitted() {
      return this.request.survey && !!Object.values(this.request.survey).length;
    },

    allowedStatusList() {
      const currentStatus = this.request.status.toLowerCase();
      return this.request.type === REQUEST_TYPE.ANOMALY
        ? ANOMALY_NEXT_STATUS[currentStatus]
        : NEXT_STATUS[currentStatus];
    },

    editorToolbar() {
      return editorToolbar;
    },

    isAdmin() {
      return this.$auth.check("admin");
    },

    apiUrl() {
      return ApplicationSettings.VUE_APP_OPENPAAS_URL;
    }
  },
  methods: {
    isUserExpert() {
      return this.getUser && this.getUser.type === USER_TYPE.EXPERT;
    },
    scrollToEvent(event) {
      const element = this.$refs[`event-${event._id}`];

      if (element && element[0] && element[0].$el) {
        this.$scrollTo(element[0].$el, { offset: -80 });
      }
    },

    addEvent(isSurvey = false) {
      this.isSubmitting = true;
      const attachmentsPromise = this.commentCreationAttachments.length
        ? this.$http.getUploader().uploadAll(this.commentCreationAttachments)
        : Promise.resolve([]);

      attachmentsPromise
        .then(attachments => {
          const event = {
            author: {
              id: this.$store.state.user.user._id,
              name: this.getUser.name,
              type: this.getUser.type
            },
            comment: this.comment,
            status: this.newStatus,
            target: this.newResponsible,
            isPrivate: this.isPrivateTab
          };

          if (isSurvey) {
            event.isSurvey = isSurvey;
          }

          if (attachments.length) {
            event.attachments = attachments.map(attachment => ({
              _id: attachment._id,
              name: attachment.name,
              mimeType: attachment.type
            }));
          }

          this.$store
            .dispatch("ticket/addEvent", { ticketId: this.request._id, event })
            .then(() => {
              this.$store.dispatch("ui/displaySnackbar", {
                message: this.$i18n.t("updated"),
                color: "success"
              });
              this.resetComment();
            })
            .catch(() => {
              this.$store.dispatch("ui/displaySnackbar", {
                message: this.$i18n.t("Error while updating ticket"),
                color: "error"
              });
            });
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Error while uploading attachments"),
            color: "error"
          });
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },

    downloadFile({ _id, name }) {
      this.$http.downloadFile(_id).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    },

    resetComment() {
      this.newStatus = "";
      this.comment = "";
      this.newResponsible = {};
      this.commentCreationAttachments = [];
      this.commentCreationAttachments.length = 0;
    },

    capitalize(text) {
      return capitalize(text);
    },

    statusDisplay(status) {
      const capitalizedStatus = capitalize(status);

      return this.$i18n.t(capitalizedStatus);
    },

    assignSelf() {
      this.newResponsible = this.getUser;
    },

    assignCustomer() {
      this.newResponsible = this.request.author;
    },

    assignTo(user) {
      this.newResponsible = user;
    },

    fetchTicket() {
      this.$store.dispatch("ticket/fetchTicketById", this.$route.params.id);
    },

    copyEventLink(eventId) {
      const element = `event-${eventId}`;
      const baseUrl = `${window.location.origin}${this.$route.path}`;

      this.$copyText(`${baseUrl}#${element}`);
    },

    getSurveyUrl() {
      const { token, id } = this.request.survey;
      const { absoluteUrl } = surveyUrl(id);
      return new URL(`?token=${token}`, absoluteUrl).toString();
    }
  },
  created() {
    this.$store.dispatch("contract/fetchContracts");
    this.fetchTicket();
  }
};
</script>

<style lang="stylus">
@media only screen and (max-width: 959px) {
  .v-stepper__label {
    display: block !important;
  }
}

.btn-action-list span {
  font-weight: bold;
}

.is-private-tab .ql-container {
  background-color: #ffcdd2;
}

.v-tabs__item  .v-chip__content {
  font-weight: 600;
}

.v-tabs__container--icons-and-text .v-tabs__item {
  flex-direction: initial !important;
}
</style>

<style lang="stylus" scoped>

.center-avatar {
  align-items: center;
}

.progress-arrow {
  font-size: 3.5em;
  display: block;
}

.information {
  padding: 0px;
}

.subject-text {
  white-space: pre-line;
}

.container {
  max-width: 100% !important;
  padding: 0px;
}

.container.grid-list-md .layout .flex {
  padding: 6px;
}

.quillWrapper, .ql-editor {
  width: 100%;
}

.arrow-down {
  transform: rotate(90deg);
  position: absolute;
  left: 45%;
  width: 10%;
}

#crumbs {
  text-align: center;
}

#crumbs ul {
  list-style: none;
  display: inline-table;
}

#crumbs ul li {
  display: inline;
}

#crumbs ul li a {
  display: block;
  float: left;
  height: 50px;
  background: #3498db;
  text-align: center;
  padding: 30px 40px 0 80px;
  position: relative;
  margin: 0 10px 0 0;
  font-size: 20px;
  text-decoration: none;
  color: #fff;
}

#crumbs ul li a:after {
  content: '';
  border-top: 40px solid transparent;
  border-bottom: 40px solid transparent;
  border-left: 40px solid #3498db;
  position: absolute;
  right: -40px;
  top: 0;
  z-index: 1;
}

#crumbs ul li a:before {
  content: '';
  border-top: 40px solid transparent;
  border-bottom: 40px solid transparent;
  border-left: 40px solid #d4f2ff;
  position: absolute;
  left: 0;
  top: 0;
}

#crumbs ul li:first-child a {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

#crumbs ul li:first-child a:before {
  display: none;
}

#crumbs ul li:last-child a {
  padding-right: 80px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

#crumbs ul li:last-child a:after {
  display: none;
}

#crumbs ul li a:hover {
  background: #fa5ba5;
}

#crumbs ul li a:hover:after {
  border-left-color: #fa5ba5;
}

.comment-mine {
  background-color: #eaf6ff !important;
  border-radius: 20px !important;
  padding: 10px !important;
  margin: 10px !important;
  width: 90% !important;
  float: left !important;
}

.comment-not-mine {
  background-color: #f5f5f5 !important;
  border-radius: 20px !important;
  padding: 10px !important;
  margin: 10px !important;
  width: 90% !important;
  float: right !important;
}

.custom-comment-box {
  width: 100% !important;
}

.comment-not-mine div {
  background-color: #f5f5f5 !important;
}

.comment-padding {
  margin: 0 20px 0 20px;
}

.comment-mine div {
  background-color: #eaf6ff !important;
}

.v-expansion-panel__body .flex.xs2 {
  width: auto;
  float: left;
}

.v-expansion-panel__body .flex.xs2 {
  width: 80%;
  float: left;
}

.v-expansion-panel__body .v-card__text.grey--text.font-italic {
  float: right;
  width: 100%;
}

.noshadow {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}

.nobottomshadow {
  box-shadow: 0 rgba(0, 0, 0, 0.2), 0px 0px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.avatar-width {
  width: 70% !important;
}

.mx-3 {
  padding-bottom: 0px;
  margin-bottom: 0px;
}

.pb-2 {
  padding-left: 24px !important;
  padding-bottom: 24px !important;
}

.blue-bg {
  background-color: #2195f2 !important;
  color: #ffffff !important;
}

.blue-color {
  color: #2195f2 !important;
}

@media only screen and (max-width: 575px) {
  .layout.row.wrap.justify-space-between {
    margin: 0px !important;
    min-width: 100% !important;
  }
}

@media only screen and (max-width: 1263px) {
  .layout.row.wrap.justify-space-between {
    margin: 0px !important;
    min-width: 100% !important;
  }
}

.mr-5 {
  margin-right: 30px !important;
}

.v-input__icon.v-input__icon--prepend {
  margin: 0px !important;
}

.layout.row.wrap {
  /* margin-left: 0px !important; */
  /* padding-top: 10px !important; */
}

.custom-comment-btn {
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.label.file-upload-label {
  padding-left: 0px !important;
}

.grid-list-md {
  padding-left: 0px !important;
}

.fluid {
  padding-right: 24px !important;
  padding-left: 0px !important;
}

.custom-ticket-bl {
  margin-left: 16px !important;
}

.btn-actions .v-btn {
  text-transform: initial;
}

.btn-actions .v-btn:hover {
  text-decoration: underline;
}

.btn-actions .v-btn:hover:before {
  background-color: transparent;
}

.event-time {
  color: inherit;
  text-decoration: none;
}

.event-time:hover {
  color:#00A0C6;
  text-decoration: underline
  cursor:pointer;
}

#submission .btn-list {
  min-width:0;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  box-shadow: none;
}

#submission .btn-submit {
  margin-right: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  box-shadow: none;
  border-right: 1px solid rgba(1, 9, 16, 0.1);
}

@media only screen and (max-width: 599px) {
  .comment-padding {
    margin: 0;
  }

  .v-timeline--dense:before,
  .v-timeline-item .v-card:before,
  .v-timeline-item .v-card:after {
    display: none;
  }

  .v-timeline-item {
    display: flex;
    justify-content: center;
  }

  .v-timeline-item >>> .v-timeline-item__body {
    max-width: calc(100% - 20px);
  }
}
</style>
