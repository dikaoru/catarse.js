import m from 'mithril';
import _ from 'underscore';
import h from '../h';

const projectContributionReportContentCard = {
    controller(args) {
        const project = args.project(),
              stateClass = (state) => {
                  const classes = {
                      online: {
                          'paid': 'text-success.fa-circle',
                          'refunded': 'text-error.fa-circle',
                          'pending_refund': 'text-error.fa-circle',
                          'pending': 'text-waiting.fa-circle',
                          'refused': 'text-error.fa-circle'
                      },
                      failed: {
                          'paid': 'text-error.fa-circle-o',
                          'refunded': 'text-refunded.fa-circle',
                          'pending_refund': 'text-refunded.fa-circle-o',
                          'pending': 'text-refunded',
                          'refused': 'text-refunded'
                      },
                      waiting_funds: {
                          'paid': 'text-success.fa-circle',
                          'refunded': 'text-error.fa-circle',
                          'pending_refund': 'text-error.fa-circle',
                          'pending': 'text-waiting.fa-circle',
                          'refused': 'text-error.fa-circle'
                      },
                      successful: {
                          'paid': 'text-success.fa-circle',
                          'refunded': 'text-error.fa-circle',
                          'pending_refund': 'text-error.fa-circle',
                          'pending': 'text-waiting.fa-circle',
                          'refused': 'text-error.fa-circle'
                      }
                  };

                  return classes[project.state][state];
              };

        return {
            stateClass: stateClass,
            expandToggle: args.expandToggle
        };
    },
    view(ctrl, args) {
        let contribution = args.contribution(),
            profile_img = (_.isEmpty(contribution.profile_img_thumbnail) ? '/assets/catarse_bootstrap/user.jpg' : contribution.profile_img_thumbnail),
            reward = contribution.reward || {minimum_value: 0, description: 'Nenhuma recompensa selecionada'};
        return m(`.w-clearfix.${(ctrl.expandToggle() ? 'card-detailed-open' : '')}`, [
            m('.card.card-clickable', [
                m('.w-row', {
                    onclick: ctrl.expandToggle.toggle
                },[
                    m('.w-col.w-col-1.w-col-tiny-1', [
                        m(`img.user-avatar.u-marginbottom-10[src='${profile_img}']`)
                    ]),
                    m('.w-col.w-col-11.w-col-tiny-11', [
                        m('.w-row', [
                            m('.w-col.w-col-3', [
                                m('.fontcolor-secondary.fontsize-mini.fontweight-semibold', h.momentify(contribution.created_at, 'DD/MM/YYYY, HH:mm')),
                                m('.fontweight-semibold.fontsize-smaller.lineheight-tighter', contribution.user_name),
                                m('.fontsize-smallest.lineheight-looser', [
                                    (contribution.has_another ? [
                                        m('a.link-hidden-light.badge.badge-light', '+1 apoio '),
                                    ] : ''),
                                    (contribution.anonymous ? m('span.fa.fa-eye-slash.fontcolor-secondary', m('span.fontcolor-secondary[style="font-size:11px;"]', ' Apoio não-público')) : '')
                                ]),
                                m('.fontsize-smallest.lineheight-looser', (contribution.email))
                            ]),
                            m('.w-col.w-col-3', [
                                m('.lineheight-tighter', [
                                    m(`span.fa.fontsize-smallest.${ctrl.stateClass(contribution.state)}`),
                                    '   ',
                                    m('span.fontsize-large', `R$ ${h.formatNumber(contribution.value, 2, 3)}`)
                                ])
                            ]),
                            m('.w-col.w-col-3.w-hidden-small.w-hidden-tiny', [
                                m('.fontsize-smallest.fontweight-semibold', `Recompensa: R$ ${h.formatNumber(reward.minimum_value, 2, 3)}`),
                                m('.fontsize-smallest', reward.description.substring(0, 80) + '...')
                            ])
                        ])
                    ])
                ]),
                m('a.w-inline-block.arrow-admin.fa.fa-chevron-down.fontcolor-secondary[href="javascript:void(0);"]', { onclick: ctrl.expandToggle.toggle }),
            ]),
            (ctrl.expandToggle() ? m(".card.details-backed-project.w-tabs[data-duration-in='300'][data-duration-out='100']", [
                m(".w-tab-menu", [
                    m("a.dashboard-nav-link.w-inline-block.w-tab-link.w--current[data-w-tab='Tab 1']", [
                        m("div", "Apoio")
                    ]),
                    //m("a.dashboard-nav-link.w-inline-block.w-tab-link[data-w-tab='Tab 2']", [
                    //    m("div", "Questionário")
                    //]),
                    //m("a.dashboard-nav-link.w-inline-block.w-tab-link[data-w-tab='Tab 3']", [
                    //    m("div", "Perfil")
                    //])
                ]),
                m('.card.card-terciary.w-tab-content', [
                    m('.w-tab-pane.w--tab-active', [
                        m('.w-row', [
                            m('.w-col.w-col-6', [
                                m('.fontsize-base.fontweight-semibold.u-marginbottom-20', `Apoio: R$ ${h.formatNumber(contribution.value, 2, 3)}`),
                                m('.fontsize-small.fontweight-semibold.u-marginbottom-10', `Recompensa: ${h.formatNumber(reward.minimum_value, 2, 3)}`),
                                m('p.fontsize-smaller', reward.description),
                                m('.u-marginbottom-20', [
                                    m('.fontsize-smaller.fontweight-semibold', 'Estimativa de entrega'),
                                    m('.fontsize-smaller', reward.deliver_at)
                                ])
                            ])
                            //m('.w-col.w-col-6', [
                            //    m('.u-marginbottom-20', [
                            //        m('.u-marginbottom-20', [
                            //            m('.fontsize-smaller.u-marginbottom-10', [
                            //                m('span.fa.fa-barcode', ".")," ",
                            //                m('a.link-hidden.fontweight-semibold', 'Boleto ')
                            //            ])
                            //        ]),
                            //        m('.fontsize-smaller.fontweight-semibold', [
                            //            m('span.fa.fa-circle.text-error', '.'),' Não finalizado'
                            //        ]),
                            //        m('.fontcolor-secondary.fontsize-smallest', '19/05/2015, 01:20 h')
                            //    ])
                            //])
                        ])
                    ]),
                    //m(".w-tab-pane[data-w-tab='Tab 2']", [
                    //    m(".fontsize-smaller.lineheight-tighter.u-marginbottom-20", "Respondido em 19/10/2015"),
                    //    m(".fontsize-small", [
                    //        m(".fontweight-semibold.lineheight-looser", "Nome e endereço"),
                    //        m("p", [
                    //        ])
                    //    ]),
                    //]),
                    //m(".w-tab-pane[data-w-tab='Tab 3']", [
                    //    m(".fontsize-small", [
                    //        m("p", [
                    //        ])
                    //    ])
                    //])
                ])
            ]) : '')
        ]);
    }
};

export default projectContributionReportContentCard;
